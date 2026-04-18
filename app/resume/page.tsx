import ResumeDocument from "@/components/ResumeDocument";

export const dynamic = "force-static";

export default function ResumePage({ searchParams }: { searchParams: any }) {
  const downloadValue = Array.isArray(searchParams?.download)
    ? searchParams.download[0]
    : searchParams?.download;

  return <ResumeDocument autoPrint={downloadValue === "1"} />;
}
