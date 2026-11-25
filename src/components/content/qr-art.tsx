import { renderQr } from "@/lib/qr/render";
import { sceneToSvg } from "@/lib/qr/svg";
import { site } from "@/lib/site";
import type { QrTemplate } from "@/lib/qr/templates";

/** Real, scannable examples, generated at build time. */
export function QrArt({ template, prefix = "art" }: { template: QrTemplate; prefix?: string }) {
  const svg = sceneToSvg(renderQr(site.url, template.design).scene, { idPrefix: `${prefix}-${template.id}`, title: `${template.name} QR design example` });
  return <div className="w-full [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
