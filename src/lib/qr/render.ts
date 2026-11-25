import { createMatrix, type QrMatrix } from "./matrix";
import { buildScene, type Scene } from "./scene";
import { sceneToSvg, type SvgOptions } from "./svg";
import { resolveEcLevel, type QrDesign } from "./types";

export interface RenderResult {
  matrix: QrMatrix;
  scene: Scene;
}

/** Encodes `text` and lays out the full design. Throws QrCapacityError if it does not fit. */
export function renderQr(text: string, design: QrDesign): RenderResult {
  const matrix = createMatrix(text, resolveEcLevel(design));
  return { matrix, scene: buildScene(matrix, design) };
}

export function renderQrSvg(text: string, design: QrDesign, opts?: SvgOptions): string {
  return sceneToSvg(renderQr(text, design).scene, opts);
}
