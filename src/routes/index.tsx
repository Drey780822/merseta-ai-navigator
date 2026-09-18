import { createFileRoute } from "@tanstack/react-router";
import { MersetaWorkspace } from "@/components/merseta-workspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "merSETA Extractor — Skills Intelligence Workspace" },
      {
        name: "description",
        content:
          "Turn institutional documents into structured skills knowledge: upload, extract, and explore occupational intelligence.",
      },
      { property: "og:title", content: "merSETA Extractor — Skills Intelligence Workspace" },
      {
        property: "og:description",
        content:
          "Upload a document, start a research session, or explore extracted skills and occupational intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MersetaWorkspace />;
}
