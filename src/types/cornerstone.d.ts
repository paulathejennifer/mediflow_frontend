declare module 'cornerstone-core' {
  export interface EnableableElement extends HTMLElement {
    addEventListener: typeof HTMLElement.prototype.addEventListener
    removeEventListener: typeof HTMLElement.prototype.removeEventListener
  }

  export function enable(element: EnableableElement): Promise<void>
  export function disable(element: EnableableElement): void
  export function loadImage(imageId: string): Promise<any>
  export function displayImage(element: EnableableElement, image: any): void
  export const external: any
}

declare module 'cornerstone-wado-image-loader' {
  export const webWorkerManager: {
    initialize: (config: { maxWebWorkers: number; startWebWorkersOnDemand: boolean }) => void
  }
  export const external: {
    cornerstone: any
  }
}

declare module 'cornerstone-tools' {
  export const external: {
    cornerstone: any
    cornerstoneMath: any
  }
  export function init(): void
  export function addTool(tool: any): void
  export function setToolActive(toolName: string, options?: { mouseButtonMask?: number }): void
  export class ZoomTool {}
  export class PanTool {}
  export class RotateTool {}
}

declare module 'cornerstone-math' {
  export const point: any
  export const lineSegment: any
}
