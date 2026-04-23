import type { Metadata } from "next";
import { DirectoryControls } from "./directory-controls";
import { MOCK_ENTITIES } from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Directory — MarketIQ",
  description:
    "Browse Mongolia's capital markets entities — public companies, private companies, projects, and service providers.",
};

export default function DirectoryPage() {
  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <DirectoryControls entities={MOCK_ENTITIES} />
    </div>
  );
}
