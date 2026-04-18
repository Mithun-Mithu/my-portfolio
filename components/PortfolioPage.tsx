"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  Download,
  ExternalLink,
  FileStack,
  GraduationCap,
  House,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

import AnimatedBackground from "@/components/AnimatedBackground";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { resumeData } from "@/lib/resume-data";

const sectionLinks = [
  { id: "home", label: "Home", icon: House },
  { id: "highlights", label: "Highlights", icon: Trophy },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "certifications", label: "Certs", icon: ShieldCheck },
  { id: "experience", label: "Journey", icon: GraduationCap },
  { id: "more", label: "More", icon: FileStack },
];

const revealTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function PortfolioPage() {
  const prefersReducedMotion = useReducedMotion();
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("home");

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.2,
  });
  const heroOffset = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 72]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("light", initialTheme === "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowSplash(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.34;
      let nextSection = "home";

      for (const section of sectionLinks) {
        const element = document.getElementById(section.id);
        if (!element) {
          continue;
        }

        const bounds = element.getBoundingClientRect();
        if (bounds.top <= marker && bounds.bottom >= marker) {
          nextSection = section.id;
          break;
        }
      }

      setActiveSection(nextSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <AnimatedBackground />

      <motion.div
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {showSplash ? (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
          >
            <div className="w-full max-w-sm px-6 text-center">
              <motion.div
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-3xl font-semibold tracking-[0.2em] text-white shadow-glow"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                MM
              </motion.div>
              <motion.p
                className="mb-5 font-mono text-xs uppercase tracking-[0.4em] text-slate-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Loading Portfolio
              </motion.p>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-200"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="no-print fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-950/55 px-4 py-3 shadow-glow backdrop-blur-xl">
          <Link href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-semibold tracking-[0.18em]">
              MM
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{resumeData.basics.name}</p>
              <p className="text-xs text-slate-400">Futuristic portfolio view</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {sectionLinks.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white",
                  activeSection === section.id && "bg-white/10 text-white",
                )}
              >
                {section.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          />
        </div>
      </header>

      <main className="relative z-10 pb-28">
        <section
          id="home"
          className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pt-28 sm:px-6 lg:px-8"
        >
          <motion.div
            className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            style={{ y: heroOffset }}
          >
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                Personal Information
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-8xl">
                {resumeData.basics.name}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                {resumeData.basics.title}
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                {resumeData.basics.summary}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="#experience">
                    View Experience
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full border border-white/10 bg-white/5 px-8 text-white hover:bg-white/10"
                >
                  <Link href="/resume?download=1">
                    Download Resume
                    <Download className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {resumeData.highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    className="glass-panel rounded-3xl px-4 py-4 shadow-glow"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...revealTransition, delay: 0.12 * (index + 1) }}
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Top Highlight</p>
                    <p className="mt-2 text-base font-medium text-white">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.15 }}
            >
              <div className="section-shell glass-panel relative rounded-[32px] p-6 sm:p-8">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-400">
                      First View
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Resume Snapshot</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Page 1 of 1
                  </div>
                </div>

                <div className="grid gap-4">
                  <Card className="rounded-[24px] border-white/10 bg-white/[0.03] text-white shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-4 w-4 text-sky-300" />
                        Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300">
                      {resumeData.basics.location}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] border-white/10 bg-white/[0.03] text-white shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-4 w-4 text-sky-300" />
                        Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-slate-300">
                      <a href={`mailto:${resumeData.basics.email}`} className="block break-all">
                        {resumeData.basics.email}
                      </a>
                      {resumeData.basics.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-slate-200"
                        >
                          <Linkedin className="h-4 w-4 text-sky-300" />
                          {link.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] border-white/10 bg-white/[0.03] text-white shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-4 w-4 text-sky-300" />
                        Resume Focus
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Built only from the provided resume details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {resumeData.resumeFocus.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="highlights" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="section-shell p-6 sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
          >
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
                  Above The Fold
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Top Resume Highlights
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                The provided resume does not include measurable achievement bullets yet, so this strip
                spotlights the strongest direct signals already present in the source.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {resumeData.topHighlightCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ ...revealTransition, delay: index * 0.08 }}
                >
                  <Card className="group h-full rounded-[28px] border-white/10 bg-white/[0.04] text-white shadow-glow transition hover:-translate-y-1 hover:border-sky-300/30">
                    <CardHeader>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-200">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="text-slate-400">{item.kicker}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-7 text-slate-300">{item.description}</p>
                      <div className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-sky-100">
                        {item.badge}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="skills" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="section-shell p-6 sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
          >
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">Skills</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Core capability map</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Every skill shown here comes directly from the supplied resume content.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {resumeData.skills.map((group, index) => (
                <motion.div
                  key={group.group}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ ...revealTransition, delay: index * 0.08 }}
                >
                  <Card className="h-full rounded-[28px] border-white/10 bg-white/[0.04] text-white shadow-none">
                    <CardHeader>
                      <CardTitle className="text-xl">{group.group}</CardTitle>
                      <CardDescription className="text-slate-400">
                        Structured from the resume without adding new skills.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="certifications" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="section-shell p-6 sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
          >
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
                  Certifications
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Credibility backed by certification
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {resumeData.certifications.length} listed credentials
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {resumeData.certifications.map((certification, index) => (
                <motion.div
                  key={certification.name}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ ...revealTransition, delay: index * 0.08 }}
                >
                  <Card className="group h-full rounded-[28px] border-white/10 bg-white/[0.04] text-white shadow-none transition hover:-translate-y-1 hover:border-sky-300/25">
                    <CardHeader>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-200">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{certification.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {certification.context}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="experience" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="section-shell p-6 sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
          >
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
                  Experience
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Education & learning journey
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                The supplied resume centers on academic milestones, skills, and certifications, so the
                story cards below preserve that trajectory instead of inventing work history.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <Card className="rounded-[28px] border-white/10 bg-white/[0.04] text-white shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Journey snapshot</CardTitle>
                  <CardDescription className="text-slate-400">
                    Highlighted directly from the resume data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Current degree</p>
                    <p className="mt-2 text-base text-slate-100">
                      Bachelor of Science, Computer Science
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Current timeline</p>
                    <p className="mt-2 text-base text-slate-100">August 2023 - May 2026</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Location</p>
                    <p className="mt-2 text-base text-slate-100">{resumeData.basics.location}</p>
                  </div>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="space-y-4">
                {resumeData.education.map((entry, index) => (
                  <AccordionItem
                    key={`${entry.institution}-${entry.dates}`}
                    value={`${entry.institution}-${index}`}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] px-0 text-white"
                  >
                    <AccordionTrigger className="px-6 py-5 text-left text-base hover:no-underline sm:px-8">
                      <div>
                        <p className="text-lg font-semibold">{entry.institution}</p>
                        <p className="mt-1 text-sm text-slate-400">{entry.dates}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0 sm:px-8">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        {entry.study ? (
                          <p className="text-base text-slate-100">{entry.study}</p>
                        ) : (
                          <p className="text-base text-slate-100">{entry.raw.join(" ")}</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </section>

        <section id="more" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="section-shell p-6 sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
          >
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">More</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Complete resume trace
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                This section preserves every extracted line from the PDF so no part of the supplied resume
                is lost or guessed.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
              <Card className="rounded-[28px] border-white/10 bg-white/[0.04] text-white shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Additional details</CardTitle>
                  <CardDescription className="text-slate-400">
                    Items that did not fit neatly into the main portfolio panels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resumeData.extra.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                {resumeData.sourceLines.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ ...revealTransition, delay: (index % 6) * 0.03 }}
                    className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-200 shadow-none"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="section-shell rounded-[28px] px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Let&apos;s stay connected</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Every contact detail below is sourced from the resume that was provided.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-200">
                <a href={`mailto:${resumeData.basics.email}`} className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-300" />
                  {resumeData.basics.email}
                </a>
                <div className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-300" />
                  {resumeData.basics.location}
                </div>
                {resumeData.basics.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4 text-sky-300" />
                    {link.rawText}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      <nav className="no-print fixed inset-x-4 bottom-4 z-40 rounded-full border border-white/10 bg-slate-950/70 px-2 py-2 shadow-glow backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-6 gap-1">
          {sectionLinks.map((section) => (
            <Link
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "flex flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] text-slate-400 transition",
                activeSection === section.id && "bg-white/10 text-white",
              )}
            >
              <section.icon className="mb-1 h-4 w-4" />
              <span>{section.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
