/** @jsx jsx */
import { jsx } from 'theme-ui'

const Grid = ({
  size,
  height = 24,
}) => {
  const x = Array.from({ length: 32 })
    .map((n, i) => `M${i} 0 V${height}`)
  const y = Array.from({ length: height })
    .map((n, i) => `M0 ${i} H32`)
  return (
    <g
      fill='none'
      stroke='rgba(255, 0, 0, .25)'
      strokeWidth={1/32}
    >
      {x.map(d => (
        <path key={d} d={d} />
      ))}
      {y.map(d => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

export default ({
  width = 512,
  height = 384,
  nodes = [
  ],
  edges = [
    // connect point 0 to point 1
    // [0, 1],
  ],
  strokeWidth = 1,
  grid,
  title,
}) => {
  const ratio = height / width
  const y = 32 * ratio
  const dots = nodes.map(([x, y, r = 3.5, label]) =>
    <g key={x + y + label}>
      <circle
        cx={x}
        cy={y}
        r={r}
      />
      {label && (
        <text
          x={x}
          y={y + 1/2}
          textAnchor='middle'
          sx={{
            fill: 'background',
          }}>
          {label}
        </text>
      )}
    </g>
  )

  const edgePath = edges.map(([a, b], i) => {
    const [ ax, ay ] = nodes[a] || []
    const [ bx, by ] = nodes[b] || []
    return `M${ax} ${ay} L${bx} ${by}`
  }).join(',')

  return (
    <svg
      xmlns='http://www.w3c.org/2000/svg'
      viewBox={`0 0 32 ${y}`}
      width={width}
      height={height}
      fill='currentcolor'
      sx={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '1px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '.2em',
        width: '100%',
        maxWidth: 512,
        height: 'auto',
      }}
    >
      {title && <title children={title} />}
      {grid && (
        <rect
          width={32}
          height={y}
          fill='#f6f6f6'
        />
      )}
      {grid && <Grid height={y} />}
      <path
        d={edgePath}
        fill='none'
        stroke='currentcolor'
        strokeWidth={strokeWidth}
      />
      {dots}
    </svg>
  )
}
