import { Film, Image as ImageIcon, MessageCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";

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

function SpinningServicesShape({ type }: { type: 'torus' | 'octahedron' }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.x = elapsed * 1.1;
    ref.current.rotation.y = elapsed * 0.9;
  });
  return (
    <mesh ref={ref}>
      {type === 'torus' && <torusGeometry args={[0.45, 0.16, 8, 20]} />}
      {type === 'octahedron' && <octahedronGeometry args={[0.55, 0]} />}
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function Mini3DServices({ type, isMobileOrTablet }: { type: 'torus' | 'octahedron', isMobileOrTablet: boolean }) {
  if (isMobileOrTablet) {
    return (
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white/40">
        {type === 'torus' && <Film className="size-8" />}
        {type === 'octahedron' && <ImageIcon className="size-8" />}
      </div>
    );
  }
  return (
    <div className="w-16 h-16 mx-auto mb-4 opacity-75 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[1, 1, 1]} color="#ffffff" intensity={1.5} />
        <SpinningServicesShape type={type} />
      </Canvas>
    </div>
  );
}

const offerings = [
  { 
    icon: Film, 
    title: "Video Editing", 
    desc: "Cinematic edits, short-form reels, YouTube long-form, and brand films — color-graded, sound-designed, and export-ready.",
    shape: 'torus' as const
  },
  { 
    icon: ImageIcon, 
    title: "Thumbnail Designing", 
    desc: "Click-worthy, high-CTR YouTube thumbnails crafted with strong typography, contrast, and on-brand visual hooks.",
    shape: 'octahedron' as const
  },
];

export default function Services() {
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
          Subsidiary · Operational
        </motion.span>
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-5xl md:text-7xl font-bold text-white"
        >
          Relosta <span className="text-gradient-brand">Services</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed select-none"
        >
          A focused production studio offering professional video editing and thumbnail designing — built to make your content stand out and perform.
        </motion.p>
      </motion.section>

      <section className="container mx-auto px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {offerings.map((o) => (
            <motion.div 
              key={o.title} 
              whileHover={isMobileOrTablet ? {} : { scale: 1.02, rotateY: 4, rotateX: -4 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="glass rounded-3xl p-8 border border-white/5 bg-[#120f0d]/50"
            >
              <Mini3DServices type={o.shape} isMobileOrTablet={isMobileOrTablet} />
              <h3 className="mt-5 text-2xl font-bold text-white select-none">{o.title}</h3>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed select-none">{o.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Strategic Progress Row */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/5 bg-[#120f0d]/50"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 select-none">
            How We Work
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Discovery", d: "We listen, audit, and define the real problem." },
              { n: "02", t: "Plan", d: "Scope, timeline, and a clear path to delivery." },
              { n: "03", t: "Execute", d: "Senior-led delivery with iterative reviews." },
              { n: "04", t: "Sustain", d: "Ongoing support, retainers, and improvements." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/30">
                <div className="text-gradient-brand font-extrabold text-xl">{s.n}</div>
                <div className="mt-2 text-lg font-semibold text-white select-none">{s.t}</div>
                <p className="mt-1.5 text-sm text-slate-300 leading-relaxed select-none">{s.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 md:p-10 text-center border border-white/5 bg-[#120f0d]/50"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white select-none">Join the Relosta Services community</h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm select-none">
            Get support, share feedback, and stay updated on new service offerings and features.
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
