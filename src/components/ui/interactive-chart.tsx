"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as d3 from "d3"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, Activity } from "lucide-react"

interface DataPoint {
  id: string
  label: string
  value: number
  category?: string
  timestamp?: Date
  metadata?: Record<string, any>
}

interface InteractiveChartProps {
  data: DataPoint[]
  type?: "line" | "bar" | "area" | "donut" | "heatmap"
  title?: string
  description?: string
  height?: number
  width?: number
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  interactive?: boolean
  realTime?: boolean
  colorScheme?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
  onDataPointClick?: (dataPoint: DataPoint) => void
  onDataPointHover?: (dataPoint: DataPoint | null) => void
}

const colorSchemes = {
  default: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  success: ["#10b981", "#34d399", "#6ee7b7", "#9deccd", "#c6f6d5", "#d1fae5"],
  warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7", "#fffbeb"],
  danger: ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2", "#fef2f2"],
  info: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"]
}

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type = "line",
  title,
  description,
  height = 300,
  width = 600,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  interactive = true,
  realTime = false,
  colorScheme = "default",
  className,
  onDataPointClick,
  onDataPointHover
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [hoveredPoint, setHoveredPoint] = React.useState<DataPoint | null>(null)
  const [selectedPoint, setSelectedPoint] = React.useState<DataPoint | null>(null)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const colors = colorSchemes[colorScheme]
  const margin = { top: 20, right: 30, bottom: 40, left: 50 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const renderLineChart = React.useCallback(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([innerHeight, 0])

    const line = d3.line<DataPoint>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal)

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Grid
    if (showGrid) {
      g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
        )
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.3)

      g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
        )
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.3)
    }

    // Area fill
    const area = d3.area<DataPoint>()
      .x((d, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal)

    const areaPath = g.append("path")
      .datum(data)
      .attr("fill", `url(#gradient-${type})`)
      .attr("opacity", 0.3)
      .attr("d", area)

    // Gradient definition
    const defs = svg.append("defs")
    const gradient = defs.append("linearGradient")
      .attr("id", `gradient-${type}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", innerHeight)

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colors[0])
      .attr("stop-opacity", 0.8)

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colors[0])
      .attr("stop-opacity", 0.1)

    // Line path
    const path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colors[0])
      .attr("stroke-width", 3)
      .attr("d", line)

    // Animate line drawing
    const totalLength = path.node()?.getTotalLength() || 0
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr("stroke-dashoffset", 0)

    // Data points
    const circles = g.selectAll(".data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d.value))
      .attr("r", 0)
      .attr("fill", colors[0])
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", interactive ? "pointer" : "default")

    // Animate circles
    circles
      .transition()
      .delay((d, i) => i * 50)
      .duration(300)
      .attr("r", 4)

    if (interactive) {
      circles
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 6)
            .attr("stroke-width", 3)
          
          setHoveredPoint(d)
          onDataPointHover?.(d)
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 4)
            .attr("stroke-width", 2)
          
          setHoveredPoint(null)
          onDataPointHover?.(null)
        })
        .on("click", function(event, d) {
          setSelectedPoint(d)
          onDataPointClick?.(d)
        })
    }

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(i => data[i as number]?.label || ""))

    g.append("g")
      .call(d3.axisLeft(yScale))

  }, [data, innerWidth, innerHeight, colors, showGrid, interactive, onDataPointClick, onDataPointHover, type])

  const renderBarChart = React.useCallback(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0])

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Bars
    const bars = g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.label) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", (d, i) => colors[i % colors.length])
      .attr("rx", 4)
      .style("cursor", interactive ? "pointer" : "default")

    // Animate bars
    bars
      .transition()
      .delay((d, i) => i * 100)
      .duration(800)
      .ease(d3.easeBounceOut)
      .attr("y", d => yScale(d.value))
      .attr("height", d => innerHeight - yScale(d.value))

    if (interactive) {
      bars
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 0.8)
            .attr("transform", "scale(1.05)")
          
          setHoveredPoint(d)
          onDataPointHover?.(d)
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("transform", "scale(1)")
          
          setHoveredPoint(null)
          onDataPointHover?.(null)
        })
        .on("click", function(event, d) {
          setSelectedPoint(d)
          onDataPointClick?.(d)
        })
    }

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))

    g.append("g")
      .call(d3.axisLeft(yScale))

  }, [data, innerWidth, innerHeight, colors, interactive, onDataPointClick, onDataPointHover])

  React.useEffect(() => {
    setIsAnimating(true)
    
    switch (type) {
      case "line":
      case "area":
        renderLineChart()
        break
      case "bar":
        renderBarChart()
        break
      default:
        renderLineChart()
    }

    setTimeout(() => setIsAnimating(false), 1500)
  }, [data, type, renderLineChart, renderBarChart])

  const getChartIcon = () => {
    switch (type) {
      case "line": return <LineChart className="h-4 w-4" />
      case "bar": return <BarChart3 className="h-4 w-4" />
      case "area": return <Activity className="h-4 w-4" />
      case "donut": return <PieChart className="h-4 w-4" />
      default: return <LineChart className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full", className)}
    >
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  {getChartIcon()}
                  {title}
                  {realTime && (
                    <Badge variant="outline" className="text-xs">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full mr-1"
                      />
                      Live
                    </Badge>
                  )}
                </CardTitle>
              )}
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
            {isAnimating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="overflow-visible"
            />
            
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && hoveredPoint && (
                <TooltipProvider>
                  <Tooltip open={true}>
                    <TooltipTrigger asChild>
                      <div className="absolute inset-0 pointer-events-none" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{hoveredPoint.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Value: {hoveredPoint.value.toLocaleString()}
                        </p>
                        {hoveredPoint.category && (
                          <p className="text-xs text-muted-foreground">
                            Category: {hoveredPoint.category}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { InteractiveChart }
export type { InteractiveChartProps, DataPoint }