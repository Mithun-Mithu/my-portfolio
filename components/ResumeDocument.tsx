"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ExternalLink, Linkedin, Mail, MapPin, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resumeData } from "@/lib/resume-data";

type ResumeDocumentProps = {
  autoPrint?: boolean;
};

export default function ResumeDocument({ autoPrint = false }: ResumeDocumentProps) {
  useEffect(() => {
    if (!autoPrint) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.print();
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoPrint]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <Button
            type="button"
            className="rounded-full"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/40 sm:p-10">
          <header className="border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-700">
                  Resume View
                </p>
                <h1 className="text-4xl font-semibold tracking-tight">{resumeData.basics.name}</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  {resumeData.basics.title}
                </p>
                <p className="text-base text-slate-700">{resumeData.basics.summary}</p>
              </div>

              <div className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-700" />
                  <span>{resumeData.basics.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-700" />
                  <a href={`mailto:${resumeData.basics.email}`}>{resumeData.basics.email}</a>
                </div>
                {resumeData.basics.links.map((link) => (
                  <div key={link.url} className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-sky-700" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="grid gap-6 py-8 md:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[24px] border-slate-200 bg-slate-50/90 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resumeData.skills.flatMap((group) => group.items).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-slate-200 bg-slate-50/90 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                {resumeData.certifications.map((certification) => (
                  <div
                    key={certification.name}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    {certification.name}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4 pb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
              <p className="mt-2 text-sm text-slate-600">
                Academic milestones captured from the provided resume.
              </p>
            </div>

            <div className="space-y-4">
              {resumeData.education.map((entry) => (
                <div
                  key={`${entry.institution}-${entry.dates}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.institution}</h3>
                      {entry.study ? <p className="text-sm text-slate-600">{entry.study}</p> : null}
                    </div>
                    <p className="text-sm font-medium text-sky-700">{entry.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Resume Source Trace</h2>
              <p className="mt-2 text-sm text-slate-600">
                Every extracted line is preserved here for completeness.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {resumeData.sourceLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {line}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
