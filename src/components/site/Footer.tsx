import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="font-bold text-2xl">
            relosta<span className="text-gradient-brand">.in</span>
          </Link>
          <p className="text-muted-foreground mt-3 max-w-md">
            A multi-agency holding company shaping creative media and operational excellence under a single vision.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Agencies</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/media" className="hover:text-foreground">Relosta Media</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Relosta Services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center gap-2"><Mail className="size-4" /> relosta.in@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> India · Worldwide</li>
          </ul>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://www.instagram.com/relosta.media/" target="_blank" rel="noreferrer"
               className="size-9 grid place-items-center rounded-full bg-foreground/5 hover:bg-foreground/10" aria-label="Instagram">
              <Instagram className="size-4" />
            </a>
            <a href="https://discord.gg/9QqyGScgdj" target="_blank" rel="noreferrer"
               className="size-9 grid place-items-center rounded-full bg-foreground/5 hover:bg-foreground/10" aria-label="Discord">
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex justify-between items-center">
          <span>© 2026 relosta.in — All rights reserved.</span>
          <span className="flex items-center gap-3">
            <span>Holding · Media · Services</span>
            <Link
              to="/admin"
              className="opacity-30 hover:opacity-100 transition text-[10px] uppercase tracking-wider px-2 py-1 rounded-md hover:bg-foreground/5"
              aria-label="Admin access"
            >
              admin access
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
