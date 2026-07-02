import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Box, Circle, Layers, Sparkles, Briefcase } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

function SpinningShape({ type }: { type: 'cube' | 'torus' | 'octa' }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.x = elapsed * 1.2;
    ref.current.rotation.y = elapsed * 1.0;
  });
  return (
    <mesh ref={ref}>
      {type === 'cube' && <boxGeometry args={[0.85, 0.85, 0.85]} />}
      {type === 'torus' && <torusGeometry args={[0.45, 0.18, 8, 24]} />}
      {type === 'octa' && <octahedronGeometry args={[0.55, 0]} />}
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function Mini3D({ type, isMobileOrTablet }: { type: 'cube' | 'torus' | 'octa', isMobileOrTablet: boolean }) {
  if (isMobileOrTablet) {
    return (
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white/40">
        {type === 'cube' && <Box className="size-8" />}
        {type === 'torus' && <Circle className="size-8" />}
        {type === 'octa' && <Layers className="size-8" />}
      </div>
    );
  }
  return (
    <div className="w-16 h-16 mx-auto mb-4 opacity-75 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[1, 1, 1]} color="#ffffff" intensity={1.5} />
        <SpinningShape type={type} />
      </Canvas>
    </div>
  );
}

function FlipCard({ title, desc, iconType, isMobileOrTablet }: { title: string, desc: string, iconType: 'cube' | 'torus' | 'octa', isMobileOrTablet: boolean }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      className="w-full h-64 relative cursor-pointer select-none"
      style={{ perspective: 1200 }}
      onMouseEnter={() => !isMobileOrTablet && setFlipped(true)}
      onMouseLeave={() => !isMobileOrTablet && setFlipped(false)}
      onClick={() => isMobileOrTablet && setFlipped(!flipped)}
    >
      <motion.div 
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full glass rounded-3xl p-7 border border-white/5 bg-[#120f0d]/50 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Mini3D type={iconType} isMobileOrTablet={isMobileOrTablet} />
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-1">Holding Mission</div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-[10px] text-muted-foreground/60 mt-3 uppercase tracking-wider">
            {isMobileOrTablet ? "Tap to reveal" : "Hover to reveal"}
          </p>
        </div>
        
        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full glass rounded-3xl p-7 border border-white/10 bg-white/[0.03] flex flex-col justify-center items-center text-center"
          style={{ 
            transform: "rotateY(180deg)", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          <div className="text-xs uppercase tracking-[0.25em] text-white/50 font-medium mb-2">{title}</div>
          <p className="text-base leading-relaxed text-slate-200">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

function SpinningSubsidiaryShape({ shape }: { shape: 'torusKnot' | 'icosahedron' }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.x = elapsed * 0.8;
    ref.current.rotation.y = elapsed * 1.0;
  });
  return (
    <mesh ref={ref}>
      {shape === 'torusKnot' ? (
        <torusKnotGeometry args={[0.55, 0.16, 64, 8]} />
      ) : (
        <icosahedronGeometry args={[0.75, 1]} />
      )}
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function SubsidiaryCard({ to, title, label, desc, shape, isMobileOrTablet }: { to: string, title: string, label: string, desc: string, shape: 'torusKnot' | 'icosahedron', isMobileOrTablet: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={isMobileOrTablet ? {} : { scale: 1.02, rotateX: 4, rotateY: -4, z: 10 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="w-full"
    >
      <Link
        to={to}
        className="group block relative glass rounded-3xl p-8 overflow-hidden h-full border border-white/5 bg-[#120f0d]/50"
      >
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
        
        {/* Interactive 3D Canvas or Mobile Fallback */}
        {isMobileOrTablet ? (
          <div className="w-full h-24 mb-4 flex items-center justify-center text-white/50">
            {shape === 'torusKnot' ? <Sparkles className="size-10" /> : <Briefcase className="size-10" />}
          </div>
        ) : (
          <div className="w-full h-32 mb-4 pointer-events-none opacity-85">
            <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[2, 2, 2]} color="#ffffff" intensity={2} />
              <SpinningSubsidiaryShape shape={shape} />
            </Canvas>
          </div>
        )}

        <h3 className="text-3xl font-bold text-white">
          {title} <span className="text-gradient-brand">{label}</span>
        </h3>
        <p className="mt-3 text-slate-300 leading-relaxed text-sm">
          {desc}
        </p>
        <div className="mt-8 inline-flex items-center gap-2 text-sm text-white font-semibold group-hover:gap-3 transition-all duration-300">
          Enter {label} <ArrowRight className="size-4" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  
  // Scroll triggered parallax effects for hero content
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="relative z-10 w-full">
      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pt-12 pb-24 text-center"
      >
        <motion.span 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] text-muted-foreground select-none"
        >
          Multi-Agency Holding Co.
        </motion.span>
        
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]"
        >
          relosta<span className="text-gradient-brand">.in</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed select-none"
        >
          One vision. Two specialized agencies. We unite creative media and operational excellence under
          a single, deliberate brand — building things that endure.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link to="/media" className="bg-gradient-brand text-primary-foreground font-semibold px-6 py-3.5 rounded-full inline-flex items-center gap-2 hover:opacity-95 shadow-glow transition duration-300">
            Explore Our Agencies <ArrowRight className="size-4" />
          </Link>
          <Link to="/contact" className="glass px-6 py-3.5 rounded-full font-semibold text-white hover:bg-white/5 transition duration-300">
            Start a Conversation
          </Link>
        </motion.div>
      </motion.section>

      {/* Mission (3D Flip Cards Section) */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <FlipCard 
            title="Mission" 
            desc="Empower brands and operators with synergistic, world-class agency capabilities under one roof." 
            iconType="cube" 
            isMobileOrTablet={isMobileOrTablet}
          />
          <FlipCard 
            title="Synergy" 
            desc="Media amplifies Services. Services scales Media. Each subsidiary makes the other sharper." 
            iconType="torus" 
            isMobileOrTablet={isMobileOrTablet}
          />
          <FlipCard 
            title="Standard" 
            desc="Premium craft, measured outcomes, and a long-term partnership ethos across every engagement." 
            iconType="octa" 
            isMobileOrTablet={isMobileOrTablet}
          />
        </motion.div>
      </section>

      {/* Two subsidiaries */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-14 text-white"
        >
          Our <span className="text-gradient-brand">Subsidiaries</span>
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <SubsidiaryCard 
            to="/media" 
            title="Relosta" 
            label="Media" 
            desc="A digital marketing agency. Social media, paid ads, SEO, and creator-led partnerships that grow brands online." 
            shape="torusKnot" 
            isMobileOrTablet={isMobileOrTablet}
          />
          <SubsidiaryCard 
            to="/services" 
            title="Relosta" 
            label="Services" 
            desc="A production studio for creators and brands. Professional video editing and high-CTR thumbnail designing." 
            shape="icosahedron" 
            isMobileOrTablet={isMobileOrTablet}
          />
        </motion.div>
      </section>
    </div>
  );
}
