const BITMAP_RESOLUTION = 64

// Module-level cache: keyed by "<path>:<resolution>"
const cache = new Map<string, number[][]>()

function createContext(size: number): OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(size, size).getContext("2d")!
  }
  // Fallback for older Safari
  const el = document.createElement("canvas")
  el.width = size
  el.height = size
  return el.getContext("2d")!
}

/**
 * Renders an SVG at the given resolution onto an offscreen canvas and returns
 * a binary 2D grid: 1 where pixel alpha >= 128, 0 elsewhere.
 *
 * Results are cached by path+resolution. On load failure, resolves with [].
 */
export async function loadIconBitmap(
  svgPath: string,
  resolution = BITMAP_RESOLUTION,
): Promise<number[][]> {
  const key = `${svgPath}:${resolution}`
  const hit = cache.get(key)
  if (hit) return hit

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const ctx = createContext(resolution)
        ctx.drawImage(img, 0, 0, resolution, resolution)
        const { data } = ctx.getImageData(0, 0, resolution, resolution)

        const grid: number[][] = []
        for (let row = 0; row < resolution; row++) {
          const rowArr: number[] = []
          for (let col = 0; col < resolution; col++) {
            const alpha = data[(row * resolution + col) * 4 + 3]
            rowArr.push(alpha >= 128 ? 1 : 0)
          }
          grid.push(rowArr)
        }

        cache.set(key, grid)
        resolve(grid)
      } catch {
        resolve([])
      }
    }
    img.onerror = () => resolve([])
    img.src = svgPath
  })
}
