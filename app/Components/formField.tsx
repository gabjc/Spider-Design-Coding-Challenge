import React from "react";

interface FormFieldProps {
	id: string;
	name: string;
	type: string;
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: () => void;
	placeholder?: string;
	maxLength?: number;
	inputMode?: "text" | "tel" | "email" | "decimal";
	className?: string;
	error?: string;
	touched?: boolean;
	prefix?: string;
	suffix?: React.ReactNode;
	"aria-describedby"?: string;
	"aria-invalid"?: boolean;
}

export default function FormField({
	id,
	name,
	type,
	label,
	value,
	onChange,
	onBlur,
	placeholder,
	maxLength,
	inputMode,
	className,
	error,
	touched,
	prefix,
	suffix,
	...ariaProps
}: FormFieldProps) {
	const hasError = touched && !!error;

	const getInputClasses = (hasError: boolean | undefined) => {
		const baseClasses =
			"w-full p-3 bg-input-bg text-text border rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-200";
		const normalBorder =
			"border-border focus:border-accent hover:border-accent/60";
		const errorBorder =
			"border-red-500 focus:border-red-500 hover:border-red-500";

		return `${baseClasses} ${hasError ? errorBorder : normalBorder} ${
			className || ""
		}`;
	};

	return (
		<div className="mb-5">
			<label className="block font-medium mb-2 text-text" htmlFor={id}>
				{label}
			</label>
			<div className="relative">
				{prefix && (
					<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text">
						{prefix}
					</span>
				)}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					maxLength={maxLength}
					inputMode={inputMode}
					className={getInputClasses(hasError)}
					{...ariaProps}
				/>
				{suffix}
			</div>
			{hasError && (
				<p
					id={`${id}-error`}
					className="text-red-400 text-sm mt-1"
					role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
