import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Mail, Send, MessageCircle, Instagram, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const schema = z.object({
  title: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  department: z.enum(["Relosta Media", "Relosta Services", "Both"]),
  description: z.string().trim().min(5, "Tell us a bit more").max(1500),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

function SpinningContactShape() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.x = elapsed * 0.8;
    ref.current.rotation.y = elapsed * 0.7;
  });
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function Mini3DContact({ isMobileOrTablet }: { isMobileOrTablet: boolean }) {
  if (isMobileOrTablet) {
    return (
      <div className="w-full h-16 mb-4 flex items-center justify-center text-white/40">
        <Mail className="size-10" />
      </div>
    );
  }
  return (
    <div className="w-full h-24 mb-4 pointer-events-none opacity-80">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[1, 1, 1]} color="#ffffff" intensity={1.5} />
        <SpinningContactShape />
      </Canvas>
    </div>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  
  const [form, setForm] = useState({
    title: "",
    email: "",
    department: "Relosta Media" as "Relosta Media" | "Relosta Services" | "Both",
    description: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast({
        title: "Validation Error",
        description: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid input details.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = parsed.data;
      const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL
        || "https://discord.com/api/webhooks/1511702442134343901/x6RmlXxnU2EiVgS7m6RsRnxHlYPLq4gtBMttb7dKjf5wyD2UawpdoXuTxqjYYY35JeIv";

      const payload = {
        username: "relosta.in — Website Lead",
        embeds: [{
          title: data.title,
          color: 16777215,
          fields: [
            { name: "Email", value: data.email, inline: true },
            { name: "Department", value: data.department, inline: true },
            { name: "Description", value: data.description },
          ],
          timestamp: new Date().toISOString(),
        }],
      };

      const fd = new FormData();
      fd.append("payload_json", JSON.stringify(payload));

      const resp = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!resp.ok && resp.status !== 204) {
        throw new Error("Webhook rejected application lead");
      }

      toast({
        description: "Message sent ✓ — We'll get back to you shortly."
      });
      
      setForm({
        title: "",
        email: "",
        department: "Relosta Media",
        description: "",
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "There was a network or server error delivering your message.");
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fieldClasses = "w-full bg-[#1e1715]/40 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-muted-foreground/60 transition duration-300";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full"
    >
      <motion.section 
        ref={headerRef}
        style={{ y: headerY, opacity: headerOpacity }}
        className="container mx-auto px-4 pt-10 pb-12 text-center"
      >
        <motion.span 
          variants={itemVariants}
          className="inline-flex px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium select-none"
        >
          Get in Touch
        </motion.span>
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-5xl md:text-7xl font-bold text-white"
        >
          Let&apos;s build <span className="text-gradient-brand">together</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed select-none"
        >
          Tell us about your brand, your project, or just say hello. We read every message.
        </motion.p>
      </motion.section>

      <section className="container mx-auto px-4 pb-16 grid lg:grid-cols-5 gap-8 max-w-6xl">
        <motion.form 
          variants={itemVariants}
          onSubmit={onSubmit} 
          className="glass rounded-3xl p-6 md:p-8 lg:col-span-3 space-y-5 border border-white/5 bg-[#120f0d]/50"
        >
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2 select-none">Subject / Title</label>
            <input 
              className={fieldClasses} 
              placeholder="e.g. Brand Partnership, Thumbnail Design..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              maxLength={120} 
              required 
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2 select-none">Email Address</label>
            <input 
              type="email" 
              className={fieldClasses} 
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              maxLength={255} 
              required 
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2 select-none">Department</label>
            <select 
              className={`${fieldClasses} appearance-none cursor-pointer`}
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value as any })}
            >
              <option value="Relosta Media" className="bg-[#120f0d] text-white">Relosta Media</option>
              <option value="Relosta Services" className="bg-[#120f0d] text-white">Relosta Services</option>
              <option value="Both" className="bg-[#120f0d] text-white">Both</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2 select-none">Project Description</label>
            <textarea 
              className={`${fieldClasses} min-h-[150px] resize-y`} 
              placeholder="Tell us a bit more about your project..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              maxLength={1500} 
              required 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-semibold px-6 py-4 rounded-2xl inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition shadow-glow cursor-pointer"
          >
            {loading ? "Sending Lead..." : (<>Send Message <Send className="size-4" /></>)}
          </motion.button>
        </motion.form>

        <motion.aside 
          variants={itemVariants}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass rounded-3xl p-8 border border-white/5 bg-[#120f0d]/50">
            <Mini3DContact isMobileOrTablet={isMobileOrTablet} />
            <h3 className="text-xl font-bold text-white mb-4 select-none">Direct Line</h3>
            <ul className="space-y-4 text-slate-300 text-sm select-none">
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-white" /> 
                <span className="hover:text-white transition duration-200">relosta.in@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-white" /> 
                <span>India · Worldwide</span>
              </li>
            </ul>
          </div>
          
          <div className="glass rounded-3xl p-8 border border-white/5 bg-[#120f0d]/50">
            <h3 className="text-xl font-bold text-white mb-4 select-none">Connect</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="https://instagram.com/relosta.media" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 py-3.5 text-sm font-semibold text-white transition-all duration-300"
              >
                <Instagram className="size-4" /> Instagram
              </a>
              <a 
                href="https://discord.gg/9QqyGScgdj" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 py-3.5 text-sm font-semibold text-white transition-all duration-300"
              >
                <MessageCircle className="size-4" /> Discord
              </a>
            </div>
          </div>
        </motion.aside>
      </section>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="rounded-3xl border border-white/10 bg-[#0f0c0b]/95 text-white max-w-md p-7 backdrop-blur-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive">Submission Failed</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              We encountered an issue routing your request to our server logs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-slate-300 text-sm leading-relaxed border-t border-b border-white/10 my-4">
            <p className="font-semibold text-white mb-1">Details:</p>
            <code className="text-xs block bg-black/40 p-3 rounded-lg overflow-x-auto text-rose-300">
              {errorMessage}
            </code>
            <p className="mt-4 text-xs">
              Please email us directly at <span className="text-white font-semibold">relosta.in@gmail.com</span> if the issue persists.
            </p>
          </div>
          <DialogFooter>
            <button 
              onClick={() => setErrorDialogOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
