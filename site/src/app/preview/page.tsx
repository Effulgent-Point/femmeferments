import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LiveSite from "@/components/LiveSite";
import PreviewBanner from "@/components/PreviewBanner";
import { checkAuth } from "@/lib/auth";
import { readDraft } from "@/lib/blobStore";
import { mergeContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview — Femme Ferments",
  robots: { index: false, follow: false },
};

// Renders the live site from the current (unpublished) draft — admin only.
export default async function Preview() {
  if (!(await checkAuth())) redirect("/bosslogin");
  const draft = await readDraft();
  const content = mergeContent(draft);
  return (
    <>
      <LiveSite content={content} />
      {/* Clearance so the fixed preview pill never covers the footer links.
          Wine-colored to blend seamlessly with the footer above it. */}
      <div aria-hidden="true" style={{ height: "4rem", background: "var(--wine)" }} />
      <PreviewBanner />
    </>
  );
}
