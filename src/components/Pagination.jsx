export default function Pagination({ page, totalItems, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i += 1) {
    if (i === 0) continue
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="btn btn-outline"
      >
        Prev
      </button>

      <div className="pagination-pages">
        {start > 1 && (
          <>
            <button
              type="button"
              className={`page-btn ${page === 1 ? 'active' : ''}`}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="page-ellipsis">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="page-ellipsis">…</span>}
            <button
              type="button"
              className={`page-btn ${page === totalPages ? 'active' : ''}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="btn btn-outline"
      >
        Next
      </button>
    </div>
  )
}