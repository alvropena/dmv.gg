interface UserNameCellProps {
  firstName: string;
  lastName: string;
  email: string;
}

export function UserNameCell({ firstName, lastName, email }: UserNameCellProps) {
  return (
    <td className="px-4 py-3">
      <div>
        <p className="font-medium">
          {firstName} {lastName}
        </p>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </td>
  );
} 