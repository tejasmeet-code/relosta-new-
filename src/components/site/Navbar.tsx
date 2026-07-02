import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const sections = [
  { to: "/", label: "Home", icon: true },
  { to: "/media", label: "Relosta Media" },
  { to: "/services", label: "Relosta Services" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav
          className={`glass rounded-full flex items-center justify-between pl-5 pr-2 py-2 transition-all duration-500 ${
            scrolled ? "shadow-soft" : ""
          }`}
        >
          <Link to="/" className="font-bold text-lg tracking-tight select-none">
            relosta<span className="text-gradient-brand">.in</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {sections.map((s) => (
              <li key={s.to}>
                <NavLink
                  to={s.to}
                  end={s.to === "/"}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-4 py-2.5 text-sm transition-all font-medium duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {s.icon && <Home className="size-3.5" />}
                      <span>{s.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-brand rounded-full shadow-[0_1px_12px_hsl(var(--primary)/0.9)]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex bg-gradient-brand text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-95 shadow-glow transition duration-300"
            >
              Get in Touch
            </Link>

            {/* Mobile Sheet Navigation */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Toggle menu"
                  className="lg:hidden size-10 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Menu className="size-5 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f0c0b]/95 border-l border-white/10 text-white w-[300px]">
                <SheetHeader className="text-left border-b border-white/10 pb-4 mb-6">
                  <SheetTitle className="text-white font-bold tracking-tight">
                    relosta<span className="text-gradient-brand">.in</span>
                  </SheetTitle>
                </SheetHeader>
                <ul className="flex flex-col gap-2">
                  {sections.map((s) => (
                    <li key={s.to}>
                      <NavLink
                        to={s.to}
                        end={s.to === "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                            isActive
                              ? "bg-gradient-brand text-primary-foreground font-semibold shadow-glow"
                              : "text-muted-foreground hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {s.icon && <Home className="size-4" />}
                        {s.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="flex justify-center w-full bg-gradient-brand text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:opacity-95 shadow-glow transition duration-300"
                  >
                    Get in Touch
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
