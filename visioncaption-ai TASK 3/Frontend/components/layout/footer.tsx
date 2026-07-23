"use client";

import { Github, Linkedin, ScanEye, Twitter } from "lucide-react";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "API Docs", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-animated flex items-center justify-center">
                <ScanEye className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold tracking-tight">
                VisionCaption AI
              </span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Premium AI-powered image captioning for creators, teams, and
              developers.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Twitter"
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VisionCaption AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, FastAPI &amp; BLIP
          </p>
        </div>
      </div>
    </footer>
  );
}
