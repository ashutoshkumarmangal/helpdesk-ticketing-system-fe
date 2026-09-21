/** Lightweight horizontal bar used for dashboard distribution charts. */
export default function ChartBar({ items, labelOf = (item) => item.label }) {
  const max = Math.max(1, ...items.map((item) => item.count))
  return (
    <div className="chart-bars">
      {items.map((item) => (
        <div className="chart-row" key={labelOf(item)}>
          <span className="chart-label">{labelOf(item)}</span>
          <div className="chart-track">
            <div
              className="chart-fill"
              style={{ width: `${Math.round((item.count / max) * 100)}%` }}
            />
          </div>
          <span className="chart-count">{item.count}</span>
        </div>
      ))}
    </div>
  )
}