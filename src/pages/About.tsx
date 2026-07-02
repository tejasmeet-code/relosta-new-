import { useMotionValue, useTransform, motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import founderShaurya from "@/assets/founder-shaurya.png";
import cofounderMajor from "@/assets/cofounder-major.png";
import cooDemon from "@/assets/coo-demonxtejas.png";

const team = [
  { name: "Shaurya Dixit",  role: "Founder",     img: founderShaurya, blurb: "Sets the vision and creative direction across both agencies." },
  { name: "MajorGamerz",    role: "Co-Founder",  img: cofounderMajor, blurb: "Drives partnerships, growth, and long-term strategic bets." },
  { name: "DemonXtejas",    role: "COO",         img: cooDemon,       blurb: "Operates the holding company day-to-day and leads delivery." },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

function TeamMemberCard({ m, isMobileOrTablet }: { m: typeof team[0], isMobileOrTablet: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  
  const imgX = useTransform(x, [-100, 100], [-5, 5]);
  const imgY = useTransform(y, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileOrTablet || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      style={
        isMobileOrTablet 
          ? {} 
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000
            }
      }
      variants={itemVariants}
      className="glass rounded-3xl p-6 text-center border border-white/5 bg-[#120f0d]/50 select-none transition-shadow duration-300"
    >
      <div 
        style={isMobileOrTablet ? {} : { transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="relative mx-auto size-40 rounded-full overflow-hidden ring-2 ring-white/10 shadow-lg bg-black"
      >
        <motion.img 
          src={m.img} 
          alt={`${m.name} — ${m.role}`} 
          style={isMobileOrTablet ? {} : { x: imgX, y: imgY, scale: 1.1 }}
          animate={{
            filter: hovered 
              ? "grayscale(0.2) contrast(1.15) brightness(1.0)" 
              : "grayscale(1.0) contrast(1.05) brightness(0.9)"
          }}
          transition={{ duration: 0.3 }}
          className="size-full object-cover select-none pointer-events-none" 
          loading="lazy" 
        />
      </div>
      <h3 style={isMobileOrTablet ? {} : { transform: "translateZ(15px)" }} className="mt-5 text-xl font-bold text-white select-none">{m.name}</h3>
      <div style={isMobileOrTablet ? {} : { transform: "translateZ(10px)" }} className="text-sm text-gradient-brand font-semibold uppercase tracking-wider mt-1 select-none">{m.role}</div>
      <p style={isMobileOrTablet ? {} : { transform: "translateZ(5px)" }} className="mt-3 text-sm text-slate-300 leading-relaxed select-none">{m.blurb}</p>
    </motion.article>
  );
}

export default function About() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full"
    >
      <section className="container mx-auto px-4 pt-10 pb-16 text-center">
        <motion.span 
          variants={itemVariants}
          className="inline-flex px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium select-none"
        >
          Our Story
        </motion.span>
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-5xl md:text-7xl font-bold text-white"
        >
          The vision behind <span className="text-gradient-brand">relosta.in</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed select-none"
        >
          relosta.in began as a creative experiment and grew into a holding company built around a simple belief:
          great media and great operations belong together. We house two specialized agencies under one roof so
          our clients get the breadth of an enterprise with the soul of a studio.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants} className="glass rounded-3xl p-8 border border-white/5 bg-[#120f0d]/50">
            <h3 className="text-2xl font-bold text-white select-none">Vision</h3>
            <p className="mt-3 text-slate-300 leading-relaxed select-none">
              To be the most trusted multi-agency holding company in our space — known for craft, candor, and
              compounding value for the brands we partner with.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass rounded-3xl p-8 border border-white/5 bg-[#120f0d]/50">
            <h3 className="text-2xl font-bold text-white select-none">Leadership Philosophy</h3>
            <p className="mt-3 text-slate-300 leading-relaxed select-none">
              Lead with taste, operate with discipline, and treat every engagement as a long game. Our leaders are
              practitioners first — they ship the work, not just talk about it.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 text-white"
        >
          Founders &amp; <span className="text-gradient-brand">Leadership</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((m) => (
            <TeamMemberCard key={m.name} m={m} isMobileOrTablet={isMobileOrTablet} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
