import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring settings for the cursor head ring
  const springConfig = { damping: 28, stiffness: 150, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, [role="button"], select, input, textarea, .cursor-pointer');
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovered(true));
        el.addEventListener("mouseleave", () => setHovered(false));
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [hidden]);

  // Canvas Mouse Trail Animation
  useEffect(() => {
    if (isMobileOrTablet) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const maxPoints = 20;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize points with starting position
    pointsRef.current = Array(maxPoints).fill(null).map(() => ({
      x: mouseRef.current.x,
      y: mouseRef.current.y
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // Update points: each point follows the one ahead of it with a lerp delay
      points[0].x = THREE_lerp(points[0].x, mouse.x, 0.35);
      points[0].y = THREE_lerp(points[0].y, mouse.y, 0.35);

      for (let i = 1; i < maxPoints; i++) {
        points[i].x = THREE_lerp(points[i].x, points[i - 1].x, 0.55);
        points[i].y = THREE_lerp(points[i].y, points[i - 1].y, 0.55);
      }

      // Draw the smooth tapered, glowing path
      if (!hidden && points.length > 1) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";

        for (let i = points.length - 1; i > 0; i--) {
          const p1 = points[i];
          const p2 = points[i - 1];
          const ratio = (points.length - i) / points.length; // 0 (tail) to 1 (head)

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Draw segments with tapering width and opacity
          ctx.strokeStyle = `rgba(255, 255, 255, ${ratio * 0.45})`;
          ctx.lineWidth = ratio * 7;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        ctx.shadowBlur = 0; // Reset shadow for other drawings
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isMobileOrTablet, hidden]);

  const THREE_lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  if (isMobileOrTablet || hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  return (
    <>
      {/* Fullscreen Canvas for the smooth trailing path */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[99999] w-full h-full"
      />

      {/* Outer Ring */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovered ? 1.6 : 1,
          backgroundColor: hovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0)",
          borderColor: hovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.35)",
          boxShadow: hovered 
            ? "0 0 15px rgba(255, 255, 255, 0.3)" 
            : "0 0 0px rgba(255, 255, 255, 0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.25 }}
        className="fixed pointer-events-none z-[99999] size-6 rounded-full border border-white/35 mix-blend-difference"
      />
      {/* Inner Dot */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovered ? 0.5 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
        className="fixed pointer-events-none z-[99999] size-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
