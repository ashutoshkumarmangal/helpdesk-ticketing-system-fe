export default function PriorityBadge({ priority }) {
  const classes = {
    LOW: 'badge badge-low',
    MEDIUM: 'badge badge-medium',
    HIGH: 'badge badge-high',
    CRITICAL: 'badge badge-critical',
  }
  return <span className={classes[priority] || 'badge'}>{priority}</span>
}