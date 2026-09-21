export default function StatusBadge({ status }) {
  const classes = {
    OPEN: 'badge badge-open',
    ASSIGNED: 'badge badge-assigned',
    IN_PROGRESS: 'badge badge-progress',
    RESOLVED: 'badge badge-resolved',
    CLOSED: 'badge badge-closed',
  }
  const label = status?.replace('_', ' ')
  return <span className={classes[status] || 'badge'}>{label}</span>
}