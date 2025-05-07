interface UserDateCellProps {
  date: string;
}

export function UserDateCell({ date }: UserDateCellProps) {
  return (
    <td className="px-4 py-3 text-center">
      {new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
  );
} 