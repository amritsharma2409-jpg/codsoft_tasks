"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, ImageIcon, MessageSquareText, Sparkles, Wand2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-20 -right-32 h-[24rem] w-[24rem] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-[20rem] w-[20rem] bg-blue-400/10 rounded-full blur-[100px] animate-blob [animation-delay:4s]" />
    </div>
  );
}

interface HeroSectionProps {
  badge?: string;
  title?: React.ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroSection({
  badge = "Powered by Salesforce BLIP Vision-Language Model",
  title,
  subtitle = "Upload any photo and get a precise, natural-language caption in under two seconds. Built for accessibility, content teams, and developers who need image understanding at scale.",
  primaryCta = { label: "Start Captioning Free", href: "/register" },
  secondaryCta = { label: "See it in action", href: "#how-it-works" },
}: HeroSectionProps) {
  return (
    <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <BackgroundOrbs />
      <div className="mx-auto max-w-5xl text-center relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-500" />
          {badge}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          {title ?? (
            <>
              Every image has a story.
              <br />
              <span className="text-gradient-static">Let AI write it.</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-all hover:shadow-xl hover:shadow-primary-500/20"
          >
            {primaryCta.label}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 glass-card px-7 py-3.5 rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            {secondaryCta.label}
          </a>
        </motion.div>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="mt-6 text-xs text-muted-foreground"
        >
          No credit card required · Free tier includes 50 captions/month
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-4xl mt-20"
      >
        <div className="relative rounded-2xl glass-card p-2 shadow-2xl shadow-black/10">
          <div className="rounded-xl overflow-hidden bg-secondary/50 aspect-[16/9] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
            <div className="flex flex-col items-center gap-4 relative">
              <div className="h-16 w-16 rounded-2xl bg-gradient-animated flex items-center justify-center shadow-xl shadow-primary-500/30">
                <ImageIcon className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                Drop an image to preview the magic
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute -left-6 top-10 glass-card rounded-xl px-4 py-3 shadow-xl max-w-[220px] hidden sm:block"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquareText className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Generated caption
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              "A golden retriever running through a field of tall grass
              at sunset"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="absolute -right-6 bottom-10 glass-card rounded-xl px-4 py-3 shadow-xl hidden sm:flex items-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium">1.4s generation time</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
