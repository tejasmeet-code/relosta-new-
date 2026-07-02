import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Scene3D from "./Scene3D";
import CustomCursor from "./CustomCursor";
import SoundToggle from "./SoundToggle";
import AcceptanceBanner from "./AcceptanceBanner";
import { useGlobalSfx } from "@/hooks/useGlobalSfx";

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useGlobalSfx();

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary selection:text-white overflow-hidden bg-[#0a0807]">
      <CustomCursor />
      <Scene3D />
      <Navbar />
      
      <main className="flex-grow relative z-10 w-full pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <SoundToggle />
      <AcceptanceBanner />
    </div>
  );
}
