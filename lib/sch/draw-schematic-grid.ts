import { colorMap } from "lib/utils/colors"
import type { INode as SvgObject } from "svgson"
import { applyToPoint, type Matrix } from "transformation-matrix"

export function drawSchematicGrid(params: {
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
  transform: Matrix
  cellSize?: number
  labelCells?: boolean
}): SvgObject {
  const { minX, minY, maxX, maxY } = params.bounds
  const cellSize = params.cellSize ?? 1
  const labelCells = params.labelCells ?? false
  const gridLines: any[] = []

  // Helper function to transform points
  const transformPoint = (x: number, y: number) => {
    const [transformedX, transformedY] = applyToPoint(params.transform, [x, y])
    return { x: transformedX, y: transformedY }
  }

  // Vertical lines
  for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += cellSize) {
    const start = transformPoint(x, minY)
    const end = transformPoint(x, maxY)
    
    gridLines.push({
      name: "line",
      type: "element",
      attributes: {
        x1: start.x.toString(),
        y1: start.y.toString(),
        x2: end.x.toString(),
        y2: end.y.toString(),
        stroke: colorMap.schematic.grid,
        "stroke-width": (0.01 * Math.abs(params.transform.a)).toString(),
        "stroke-opacity": "0.5",
      },
    })
  }

  // Horizontal lines
  for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += cellSize) {
    const start = transformPoint(minX, y)
    const end = transformPoint(maxX, y)
    
    gridLines.push({
      name: "line",
      type: "element",
      attributes: {
        x1: start.x.toString(),
        y1: start.y.toString(),
        x2: end.x.toString(),
        y2: end.y.toString(),
        stroke: colorMap.schematic.grid,
        "stroke-width": (0.01 * Math.abs(params.transform.a)).toString(),
        "stroke-opacity": "0.5",
      },
    })
  }

  // Add cell labels if enabled
  if (labelCells) {
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += cellSize) {
      for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += cellSize) {
        const point = transformPoint(x, y)
        
        gridLines.push({
          name: "text",
          type: "element",
          attributes: {
            x: (point.x - 2.5).toString(),
            y: (point.y - 2.5).toString(),
            fill: colorMap.schematic.grid,
            "font-size": ((cellSize / 5) * Math.abs(params.transform.a)).toString(),
            "fill-opacity": "0.5",
            "text-anchor": "middle",
            "dominant-baseline": "middle",
          },
          children: [
            {
              type: "text",
              value: `${x},${y}`,
              name: "",
              attributes: {},
              children: [],
            },
          ],
        })
      }
    }
  }

  return {
    name: "g",
    value: "",
    type: "element",
    attributes: { class: "grid" },
    children: gridLines,
  }
}