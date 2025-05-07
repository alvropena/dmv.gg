interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 21, columns = 11 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={`loading-skel-${idx}`}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={`col-${colIdx}`} className="px-4 py-3">
              <div
                className={`h-4 bg-muted animate-pulse rounded ${
                  colIdx === columns - 1
                    ? "w-8 mx-auto"
                    : colIdx === columns - 2
                    ? "w-16 mx-auto"
                    : "w-full"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
} 