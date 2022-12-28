import React from 'react'
import { createContext } from '../lib/createContex'

/**
 * Credits
 *
 * @see {@link https://github.com/kevinsqi/react-circular-progressbar}
 */

const VIEWBOX_WIDTH = 100
const VIEWBOX_HEIGHT = 100
const VIEWBOX_HEIGHT_HALF = 50
const VIEWBOX_CENTER_X = 50
const VIEWBOX_CENTER_Y = 50

const CIRCULAR_PROGRESS_ROOT_NAME = 'CircularProgress'

interface CircularProgressContextValue {
  getPathRatio: () => number
  getPathRadius: () => number
  circleRatio: number
  strokeWidth: number
  counterClockwise: boolean
}

const [CircularProgressProvider, useCircularProgressContext] =
  createContext<CircularProgressContextValue>(CIRCULAR_PROGRESS_ROOT_NAME)

type CircularProgressRootElement = SVGSVGElement
interface CircularProgressRootProps extends React.ComponentPropsWithRef<'svg'> {
  value: number
  circleRatio?: number
  minValue?: number
  maxValue?: number
  strokeWidth?: number
  counterClockwise?: boolean
}

const CircularProgressRoot = React.forwardRef<
  CircularProgressRootElement,
  CircularProgressRootProps
>((props, forwardedRef) => {
  const {
    circleRatio = 1,
    minValue = 0,
    maxValue = 100,
    strokeWidth = 8,
    counterClockwise = false,
    value,
    ...svgProps
  } = props
  const getPathRadius = () => {
    return VIEWBOX_HEIGHT_HALF - strokeWidth / 2
  }

  const getPathRatio = () => {
    const boundedValue = Math.min(Math.max(value, minValue), maxValue)
    return (boundedValue - minValue) / (maxValue - minValue)
  }

  return (
    <CircularProgressProvider
      getPathRadius={getPathRadius}
      getPathRatio={getPathRatio}
      circleRatio={circleRatio}
      strokeWidth={strokeWidth}
      counterClockwise={counterClockwise}
    >
      <svg {...svgProps} ref={forwardedRef} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} />
    </CircularProgressProvider>
  )
})

CircularProgressRoot.displayName = CIRCULAR_PROGRESS_ROOT_NAME

const CIRCULAR_PROGRESS_PATH_NAME = 'CircularProgressPath'
type CircularProgressPathElement = SVGPathElement
type CircularProgressPathProps = React.ComponentPropsWithRef<'path'>

const CircularProgressPath = React.forwardRef<
  CircularProgressPathElement,
  CircularProgressPathProps
>(({ style, ...props }, forwardedRef) => {
  const context = useCircularProgressContext(CIRCULAR_PROGRESS_PATH_NAME)
  const pathRadius = context.getPathRadius()
  const dashRatio = context.getPathRatio() * context.circleRatio
  const diameter = Math.PI * 2 * pathRadius
  const gapLength = (1 - dashRatio) * diameter

  return (
    <path
      {...props}
      ref={forwardedRef}
      strokeWidth={context.strokeWidth}
      fillOpacity={0}
      d={getPathDescription({ pathRadius, counterClockwise: context.counterClockwise })}
      style={{
        ...style,
        strokeDasharray: `${diameter}px ${diameter}px`,
        strokeDashoffset: `${context.counterClockwise ? -gapLength : gapLength}px`,
      }}
    />
  )
})

CircularProgressPath.displayName = CIRCULAR_PROGRESS_PATH_NAME

const CIRCULAR_PROGRESS_TRAIL_NAME = 'CircularProgressTrail'
type CircularProgressTrailElement = SVGPathElement
type CircularProgressTrailProps = React.ComponentPropsWithRef<'path'>

const CircularProgressTrail = React.forwardRef<
  CircularProgressTrailElement,
  CircularProgressTrailProps
>(({ style, ...props }, forwardedRef) => {
  const context = useCircularProgressContext(CIRCULAR_PROGRESS_TRAIL_NAME)
  const pathRadius = context.getPathRadius()
  const dashRatio = context.circleRatio
  const diameter = Math.PI * 2 * pathRadius
  const gapLength = (1 - dashRatio) * diameter

  return (
    <path
      {...props}
      ref={forwardedRef}
      strokeWidth={context.strokeWidth}
      fillOpacity={0}
      d={getPathDescription({ pathRadius, counterClockwise: context.counterClockwise })}
      style={{
        ...style,
        strokeDasharray: `${diameter}px ${diameter}px`,
        strokeDashoffset: `${context.counterClockwise ? -gapLength : gapLength}px`,
      }}
    />
  )
})

CircularProgressTrail.displayName = CIRCULAR_PROGRESS_TRAIL_NAME

const CIRCULAR_PROGRESS_TEXT_NAME = 'CircularProgressText'

interface CircularProgressTextProps extends React.ComponentPropsWithRef<'text'> {
  children?: React.ReactNode
}
type CircularProgressTextElement = SVGTextElement
const CircularProgressText = React.forwardRef<
  CircularProgressTextElement,
  CircularProgressTextProps
>((props, forwardedRef) => {
  return <text {...props} ref={forwardedRef} x={VIEWBOX_CENTER_X} y={VIEWBOX_CENTER_Y} />
})

CircularProgressText.displayName = CIRCULAR_PROGRESS_TEXT_NAME

export const CircularProgress = Object.assign(CircularProgressRoot, {
  Path: CircularProgressPath,
  Trail: CircularProgressTrail,
  Text: CircularProgressText,
})

function getPathDescription({
  pathRadius,
  counterClockwise,
}: {
  pathRadius: number
  counterClockwise: boolean
}) {
  const radius = pathRadius
  const rotation = counterClockwise ? 1 : 0

  // Move to center of canvas
  // Relative move to top canvas
  // Relative arc to bottom of canvas
  // Relative arc to top of canvas
  return `
      M ${VIEWBOX_CENTER_X},${VIEWBOX_CENTER_Y}
      m 0,-${radius}
      a ${radius},${radius} ${rotation} 1 1 0,${2 * radius}
      a ${radius},${radius} ${rotation} 1 1 0,-${2 * radius}
    `
}
