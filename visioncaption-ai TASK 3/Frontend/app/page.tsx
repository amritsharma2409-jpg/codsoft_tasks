"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  Sparkles,
  UploadCloud,
  Wand2,
  Copy,
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  Globe2,
  Github,
  Twitter,
  Linkedin,
  ImageIcon,
  ScanEye,
  MessageSquareText,
  Star,
  Menu,
  X,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg shadow-black/[0.03]">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-xl bg-gradient-animated flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <ScanEye className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">
              VisionCaption <span className="text-primary-500">AI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
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
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden glass rounded-2xl mt-2 p-4 flex flex-col gap-1 overflow-hidden"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-border my-2" />
            <a href="/login" className="px-3 py-2.5 text-sm text-muted-foreground">
              Sign in
            </a>
            <a
              href="/try"
              className="mx-3 mt-1 text-center text-sm font-medium bg-foreground text-background px-4 py-2.5 rounded-full"
            >
              Get Started Free
            </a>
          </motion.div>
        )}
      </div>
    </header>
  );
}

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-20 -right-32 h-[24rem] w-[24rem] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-[20rem] w-[20rem] bg-blue-400/10 rounded-full blur-[100px] animate-blob [animation-delay:4s]" />
    </div>
  );
}

function Hero() {
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
          Powered by Salesforce BLIP Vision-Language Model
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          Every image has a story.
          <br />
          <span className="text-gradient-static">Let AI write it.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Upload any photo and get a precise, natural-language caption in
          under two seconds. Built for accessibility, content teams, and
          developers who need image understanding at scale.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/try"
            className="group inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-all hover:shadow-xl hover:shadow-primary-500/20"
          >
            Start Captioning Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 glass-card px-7 py-3.5 rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            See it in action
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

function TrustedBy() {
  const items = ["Framer", "Linear", "Notion", "Vercel", "Arc", "Raycast"];
  return (
    <section className="py-14 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by teams who care about craft
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
          {items.map((item) => (
            <span
              key={item}
              className="text-lg font-semibold tracking-tight"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Zap,
      title: "Blazing Fast Inference",
      desc: "Optimized PyTorch pipeline delivers captions in under two seconds, even on large images.",
      className: "md:col-span-2",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      desc: "Images are processed in memory and never stored without your explicit consent.",
      className: "",
    },
    {
      icon: Globe2,
      title: "Multilingual Output",
      desc: "Generate captions in over 20 languages with a single click.",
      className: "",
    },
    {
      icon: Wand2,
      title: "Fine-Tuned Accuracy",
      desc: "Built on Salesforce's BLIP model, fine-tuned for real-world photography, product shots, and screenshots alike.",
      className: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium text-primary-500 uppercase tracking-widest">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Everything you need to describe images perfectly
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Designed for speed, accuracy, and effortless integration into your
            workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
              className={`group relative rounded-2xl glass-card p-8 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 ${f.className}`}
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-animated flex items-center justify-center mb-5 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: UploadCloud,
      title: "Upload your image",
      desc: "Drag and drop or select any JPG, PNG, or WEBP file up to 10MB.",
    },
    {
      icon: Wand2,
      title: "AI analyzes the scene",
      desc: "Our BLIP-powered engine identifies objects, context, and composition.",
    },
    {
      icon: Copy,
      title: "Copy your caption",
      desc: "Get a natural-language caption instantly, ready to use anywhere.",
    },
  ];

  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-xs font-medium text-primary-500 uppercase tracking-widest">
            How it works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Three steps to a perfect caption
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
              className="relative text-center"
            >
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      text: "VisionCaption AI cut our alt-text workflow from hours to minutes. The accuracy genuinely surprised our accessibility team.",
      name: "Maya Chen",
      role: "Head of Content, Studio Loop",
    },
    {
      text: "We integrated the API in an afternoon. Captions are consistently natural, not robotic like other tools we tried.",
      name: "Daniel Ruiz",
      role: "Founder, Framewise",
    },
    {
      text: "The best image captioning tool we've used for our e-commerce catalog. Fast, accurate, and the pricing is fair.",
      name: "Priya Nair",
      role: "Product Lead, Shelfie",
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium text-primary-500 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Loved by product and content teams
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl glass-card p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3.5 w-3.5 fill-primary-500 text-primary-500"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6">"{q.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-animated flex items-center justify-center text-white text-xs font-semibold">
                  {q.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{q.name}</p>
                  <p className="text-xs text-muted-foreground">{q.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      desc: "For individuals exploring AI captioning.",
      features: [
        "50 captions per month",
        "Standard BLIP model",
        "JPG, PNG, WEBP support",
        "Community support",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      desc: "For creators and small teams shipping content.",
      features: [
        "2,000 captions per month",
        "Priority inference queue",
        "Batch upload up to 50 images",
        "Multilingual captions",
        "Email support",
      ],
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For platforms with high-volume needs.",
      features: [
        "Unlimited captions",
        "Dedicated GPU inference",
        "Custom model fine-tuning",
        "SLA & priority support",
        "SSO & audit logs",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium text-primary-500 uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade only when you need more volume.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-foreground text-background shadow-2xl scale-[1.03]"
                  : "glass-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[11px] font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p
                className={`text-sm mt-1 ${
                  plan.highlighted ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {plan.desc}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <a
                href="/try"
                className={`mt-6 block text-center text-sm font-medium py-3 rounded-full transition-opacity hover:opacity-90 ${
                  plan.highlighted
                    ? "bg-background text-foreground"
                    : "bg-foreground text-background"
                }`}
              >
                {plan.cta}
              </a>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-background" : "text-primary-500"
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-background/90" : "text-foreground/90"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What image formats are supported?",
      a: "VisionCaption AI supports JPG, PNG, and WEBP formats up to 10MB per image.",
    },
    {
      q: "Which AI model powers the captions?",
      a: "We use Salesforce's BLIP (Bootstrapping Language-Image Pretraining) model, fine-tuned for real-world accuracy.",
    },
    {
      q: "Is there an API available?",
      a: "Yes, Pro and Enterprise plans include full REST API access with generous rate limits.",
    },
    {
      q: "Can I use this for commercial projects?",
      a: "Absolutely. All generated captions are yours to use freely, including for commercial products.",
    },
  ];

  return (
    <section id="faq" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium text-primary-500 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl glass-card p-6"
            >
              <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="relative mx-auto max-w-5xl rounded-3xl bg-gradient-animated p-14 sm:p-20 text-center overflow-hidden"
      >
        <div className="absolute inset-0 noise" />
        <h2 className="relative text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Ready to caption smarter?
        </h2>
        <p className="relative mt-4 text-white/80 max-w-xl mx-auto">
          Join thousands of creators and developers using VisionCaption AI
          to describe images instantly and accurately.
        </p>
        <a
          href="/try"
          className="relative mt-8 inline-flex items-center gap-2 bg-white text-primary-700 px-7 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
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
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
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

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
