import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	type?: "text" | "textarea" | "datetime-local";
	required?: boolean;
	placeholder?: string;
	className?: string;
}

export function FormField({
	label,
	name,
	value,
	onChange,
	type = "text",
	required = false,
	placeholder,
	className,
}: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={name}>{label}</Label>
			{type === "textarea" ? (
				<Textarea
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					className={className}
				/>
			) : (
				<Input
					type={type}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					className={className}
				/>
			)}
		</div>
	);
}

interface SelectFieldProps {
	label: string;
	name: string;
	value: string;
	onValueChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
}

export function SelectField({
	label,
	name,
	value,
	onValueChange,
	options,
	placeholder,
}: SelectFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={name}>{label}</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
