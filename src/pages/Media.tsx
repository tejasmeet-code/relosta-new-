import { useState, useEffect, useRef } from "react";
import { Users, Share2, MessageCircle, Video, Crown, Headphones, UserCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

function SpinningMediaShape({ type }: { type: 'sphere' | 'torus' | 'cylinder' }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.x = elapsed * 1.0;
    ref.current.rotation.y = elapsed * 0.8;
  });
  return (
    <mesh ref={ref}>
      {type === 'sphere' && <sphereGeometry args={[0.55, 12, 12]} />}
      {type === 'torus' && <torusGeometry args={[0.4, 0.15, 8, 20]} />}
      {type === 'cylinder' && <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />}
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function Mini3DMedia({ type, isMobileOrTablet }: { type: 'sphere' | 'torus' | 'cylinder', isMobileOrTablet: boolean }) {
  if (isMobileOrTablet) {
    return (
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white/40">
        {type === 'sphere' && <Users className="size-8" />}
        {type === 'torus' && <Share2 className="size-8" />}
        {type === 'cylinder' && <Video className="size-8" />}
      </div>
    );
  }
  return (
    <div className="w-16 h-16 mx-auto mb-4 opacity-75 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 50 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[1, 1, 1]} color="#ffffff" intensity={1.5} />
        <SpinningMediaShape type={type} />
      </Canvas>
    </div>
  );
}

const offerings = [
  { 
    icon: Users, 
    title: "Brand Social Media Management", 
    desc: "End-to-end social media management for brands — content planning, posting, community engagement, and growth across all platforms.",
    shape: 'sphere' as const
  },
  { 
    icon: Share2, 
    title: "Creator–Brand Partnerships", 
    desc: "We connect top-tier creators with brands for paid partnerships — sourcing, negotiation, and execution handled end-to-end.",
    shape: 'torus' as const
  },
];

const youtuberFeatures = [
  { 
    icon: UserCheck, 
    title: "Personal YouTube & Discord Manager", 
    desc: "Dedicated personal management to guide your strategy, coordinate sponsorships, and grow your presence across platforms." 
  },
  { 
    icon: Crown, 
    title: "Priority Sponsor Access", 
    desc: "Direct access to high-value opportunities and immediate placement matching with tier-one brand campaigns." 
  },
  { 
    icon: Headphones, 
    title: "24/7 Support Channel Structure", 
    desc: "Round-the-clock priority communications pipeline, ensuring you are never left without assistance." 
  },
];

export default function Media() {
  const [open, setOpen] = useState(false);
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
        className="container mx-auto px-4 pt-10 pb-20 text-center"
      >
        <motion.span 
          variants={itemVariants}
          className="inline-flex px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium select-none"
        >
          Subsidiary · Creative
        </motion.span>
        
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-5xl md:text-7xl font-bold text-white"
        >
          Relosta <span className="text-gradient-brand">Media</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
        >
          A digital marketing agency focused on brand social media management and connecting top creators with brands for paid partnerships.
        </motion.p>
      </motion.section>

      <section className="container mx-auto px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {offerings.map((o) => (
            <div 
              key={o.title}
              className="w-full relative select-none"
              style={{ perspective: 1000 }}
            >
              <motion.div 
                whileHover={isMobileOrTablet ? {} : { scale: 1.02, rotateY: 4, rotateX: -4 }}
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-7 border border-white/5 bg-[#120f0d]/50 flex flex-col justify-between h-full"
              >
                <div>
                  <Mini3DMedia type={o.shape} isMobileOrTablet={isMobileOrTablet} />
                  <h3 className="mt-5 text-xl font-bold text-white select-none">{o.title}</h3>
                  <p className="mt-2 text-slate-300 text-sm leading-relaxed select-none">{o.desc}</p>
                </div>
              </motion.div>
            </div>
          ))}
          
          <div
            className="w-full relative select-none cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={() => setOpen(true)}
          >
            <motion.div
              whileHover={isMobileOrTablet ? {} : { scale: 1.02, rotateY: 4, rotateX: -4 }}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl p-7 text-left border border-white/5 bg-[#120f0d]/50 flex flex-col justify-between h-full focus:outline-none w-full"
            >
              <div>
                <Mini3DMedia type="cylinder" isMobileOrTablet={isMobileOrTablet} />
                <h3 className="mt-5 text-xl font-bold text-white select-none">YouTuber Management</h3>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed select-none">Click to see what you get as a managed creator.</p>
              </div>
              <div className="mt-6 text-sm text-white font-semibold select-none">
                Learn more &rarr;
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl border border-white/10 max-w-lg bg-[#0f0c0b]/95 text-white p-7 backdrop-blur-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-brand">YouTuber Management</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              Premium creator management by Relosta Media.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {youtuberFeatures.map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="size-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 shrink-0 shadow-sm">
                  <f.icon className="size-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">{f.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <section className="container mx-auto px-4 pb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 md:p-10 text-center border border-white/5 bg-[#120f0d]/50"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white select-none">Join the Relosta Media community</h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm select-none">
            Connect with creators, get updates on new releases, and be part of the conversation.
          </p>
          <motion.a 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://discord.gg/9QqyGScgdj" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3.5 rounded-2xl hover:opacity-90 shadow-glow transition duration-300"
          >
            <MessageCircle className="size-4" /> Join Discord Server
          </motion.a>
        </motion.div>
      </section>
    </motion.div>
  );
}
