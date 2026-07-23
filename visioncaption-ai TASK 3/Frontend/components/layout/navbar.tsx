"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, ScanEye, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  showAuthLinks?: boolean;
}

export function Navbar({ showAuthLinks = true }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav
          className={cn(
            "glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-shadow duration-300",
            scrolled ? "shadow-lg shadow-black/[0.06]" : "shadow-none"
          )}
        >
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-xl bg-gradient-animated flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <ScanEye className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">
              VisionCaption <span className="text-primary-500">AI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {showAuthLinks && (
              <>
                <a
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign in
                </a>
                <a
                  href="/try"
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2 -mr-1 text-foreground"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden glass rounded-2xl mt-2 overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {showAuthLinks && (
                  <>
                    <div className="h-px bg-border my-2" />
                    <a
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="px-3 py-2.5 text-sm text-muted-foreground"
                    >
                      Sign in
                    </a>
                    <a
                      href="/try"
                      onClick={() => setOpen(false)}
                      className="mx-3 mt-1 text-center text-sm font-medium bg-foreground text-background px-4 py-2.5 rounded-full"
                    >
                      Get Started Free
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
