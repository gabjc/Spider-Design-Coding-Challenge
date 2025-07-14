"use client";
import { useCallback, useState } from "react";
import FormField from "./formField";

const spiderImage = "/images/spidr-logo.png";

interface FormData {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	emailAddress: string;
	airFryerGuess: string;
	secretPin: string;
}

interface FormErrors {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	emailAddress?: string;
	airFryerGuess?: string;
	secretPin?: string;
}

interface TouchedFields {
	firstName: boolean;
	lastName: boolean;
	phoneNumber: boolean;
	emailAddress: boolean;
	airFryerGuess: boolean;
	secretPin: boolean;
}

export default function InterestForm() {
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		emailAddress: "",
		airFryerGuess: "",
		secretPin: "",
	});

	const [showPin, setShowPin] = useState<boolean>(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<TouchedFields>({
		firstName: false,
		lastName: false,
		phoneNumber: false,
		emailAddress: false,
		airFryerGuess: false,
		secretPin: false,
	});

	const validators = {
		validateEmail: (email: string) =>
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
		validateName: (name: string) => name.trim().length >= 2,
		validatePhone: (phone: string) => phone.replace(/\D/g, "").length === 10,
		validatePin: (pin: string) => pin.replace(/\D/g, "").length === 16,
		validateAirFryerGuess: (guess: string) => {
			if (guess === "") return false;
			const numValue = parseFloat(guess);
			return !isNaN(numValue) && numValue > 0 && numValue <= 10000;
		},
	};

	const formatters = {
		formatPin: (value: string, isVisible: boolean) => {
			const digits = value.replace(/\D/g, "").slice(0, 16);
			return isVisible ? digits.replace(/(\d{4})(?=\d)/g, "$1-") : digits;
		},
		formatPhoneNumber: (value: string) => {
			const digits = value.replace(/\D/g, "").slice(0, 10);
			if (digits.length <= 3) return digits;
			if (digits.length <= 6)
				return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
			return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
		},
	};

	const validateFields = useCallback((): FormErrors => {
		const newErrors: FormErrors = {};

		if (!validators.validateName(formData.firstName)) {
			newErrors.firstName = "First name must be at least 2 characters";
		}
		if (!validators.validateName(formData.lastName)) {
			newErrors.lastName = "Last name must be at least 2 characters";
		}
		if (!validators.validatePhone(formData.phoneNumber)) {
			newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
		}
		if (!validators.validateEmail(formData.emailAddress)) {
			newErrors.emailAddress = "Please enter a valid email address";
		}
		if (!validators.validateAirFryerGuess(formData.airFryerGuess)) {
			newErrors.airFryerGuess =
				"Please enter a valid price between $0.01 and $999,999,999.99";
		}
		if (!validators.validatePin(formData.secretPin)) {
			newErrors.secretPin = "PIN must be exactly 16 digits";
		}

		return newErrors;
	}, [formData]);

	const handleFieldChange = useCallback(
		(
			field: keyof FormData,
			value: string,
			validator?: (val: string) => boolean
		) => {
			setFormData((prev) => ({ ...prev, [field]: value }));

			if (validator && validator(value)) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		},
		[]
	);

	const handleBlur = useCallback(
		(fieldName: keyof TouchedFields) => {
			setTouched((prev) => ({ ...prev, [fieldName]: true }));
			const newErrors = validateFields();
			setErrors((prev) => ({ ...prev, [fieldName]: newErrors[fieldName] }));
		},
		[validateFields]
	);

	const handlePhoneChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formatted = formatters.formatPhoneNumber(e.target.value);
			handleFieldChange("phoneNumber", formatted, validators.validatePhone);
		},
		[handleFieldChange]
	);

	const handlePinChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formatted = formatters.formatPin(e.target.value, showPin);
			handleFieldChange("secretPin", formatted, validators.validatePin);
		},
		[showPin, handleFieldChange]
	);

	const handleCostChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
				handleFieldChange(
					"airFryerGuess",
					value,
					validators.validateAirFryerGuess
				);
			}
		},
		[handleFieldChange]
	);

	const handleFirstNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFieldChange("firstName", e.target.value, validators.validateName);
		},
		[handleFieldChange]
	);

	const handleLastNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFieldChange("lastName", e.target.value, validators.validateName);
		},
		[handleFieldChange]
	);

	const handleEmailChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFieldChange(
				"emailAddress",
				e.target.value,
				validators.validateEmail
			);
		},
		[handleFieldChange]
	);

	const togglePinVisibility = useCallback(() => {
		const newShowPin = !showPin;
		setShowPin(newShowPin);
		setFormData((prev) => ({
			...prev,
			secretPin: formatters.formatPin(prev.secretPin, newShowPin),
		}));
	}, [showPin]);

	const isFormValid = useCallback(() => {
		return Object.keys(validateFields()).length === 0;
	}, [validateFields]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();

			const allTouched: TouchedFields = {
				firstName: true,
				lastName: true,
				phoneNumber: true,
				emailAddress: true,
				airFryerGuess: true,
				secretPin: true,
			};
			setTouched(allTouched);

			const validationErrors = validateFields();
			setErrors(validationErrors);

			if (Object.keys(validationErrors).length === 0) {
				console.log("Interest form submitted successfully!");
				console.log({
					firstName: formData.firstName,
					lastName: formData.lastName,
					phoneNumber: formData.phoneNumber.replace(/\D/g, ""),
					emailAddress: formData.emailAddress,
					airFryerGuess: parseFloat(formData.airFryerGuess),
					secretPin: formData.secretPin.replace(/\D/g, ""),
				});
			}
		},
		[formData, validateFields]
	);

	return (
		<div
			className="bg-center bg-no-repeat"
			style={{ backgroundImage: `url(${spiderImage})` }}>
			<form
				onSubmit={handleSubmit}
				className="text-text p-8 shadow-lg max-w-lg mx-auto bg-accent/90 bg-cover bg-center bg-no-repeat"
				style={{ fontFamily: "Raleway, sans-serif" }}
				noValidate>
				<h2
					className="text-2xl mb-6 text-center text-text"
					style={{ fontFamily: "Raleway, sans-serif" }}>
					Air Fryer Interest Form
				</h2>

				<FormField
					id="firstName"
					name="firstName"
					type="text"
					label="First Name"
					value={formData.firstName}
					onChange={handleFirstNameChange}
					onBlur={() => handleBlur("firstName")}
					error={errors.firstName}
					touched={touched.firstName}
					aria-describedby={errors.firstName ? "firstName-error" : undefined}
					aria-invalid={touched.firstName && !!errors.firstName}
				/>

				<FormField
					id="lastName"
					name="lastName"
					type="text"
					label="Last Name"
					value={formData.lastName}
					onChange={handleLastNameChange}
					onBlur={() => handleBlur("lastName")}
					error={errors.lastName}
					touched={touched.lastName}
					aria-describedby={errors.lastName ? "lastName-error" : undefined}
					aria-invalid={touched.lastName && !!errors.lastName}
				/>

				<FormField
					id="phoneNumber"
					name="phoneNumber"
					type="tel"
					label="Phone Number"
					placeholder="(###) ###-####"
					value={formData.phoneNumber}
					onChange={handlePhoneChange}
					onBlur={() => handleBlur("phoneNumber")}
					maxLength={14}
					error={errors.phoneNumber}
					touched={touched.phoneNumber}
					aria-describedby={
						errors.phoneNumber ? "phoneNumber-error" : undefined
					}
					aria-invalid={touched.phoneNumber && !!errors.phoneNumber}
				/>

				<FormField
					id="emailAddress"
					name="emailAddress"
					type="email"
					label="Email Address"
					value={formData.emailAddress}
					onChange={handleEmailChange}
					onBlur={() => handleBlur("emailAddress")}
					error={errors.emailAddress}
					touched={touched.emailAddress}
					aria-describedby={
						errors.emailAddress ? "emailAddress-error" : undefined
					}
					aria-invalid={touched.emailAddress && !!errors.emailAddress}
				/>

				<FormField
					id="airFryerGuess"
					name="airFryerGuess"
					type="text"
					label="Guess the Air Fryer's Cost"
					placeholder="0.00"
					value={formData.airFryerGuess}
					onChange={handleCostChange}
					onBlur={() => handleBlur("airFryerGuess")}
					inputMode="decimal"
					className="pl-8"
					prefix="$"
					error={errors.airFryerGuess}
					touched={touched.airFryerGuess}
					aria-describedby={
						errors.airFryerGuess ? "airFryerGuess-error" : undefined
					}
					aria-invalid={touched.airFryerGuess && !!errors.airFryerGuess}
				/>

				<FormField
					id="secretPin"
					name="secretPin"
					type={showPin ? "text" : "password"}
					label="Very, VERY Secret 16‑digit Spidr PIN"
					placeholder={showPin ? "####-####-####-####" : "################"}
					value={formData.secretPin}
					onChange={handlePinChange}
					onBlur={() => handleBlur("secretPin")}
					maxLength={showPin ? 19 : 16}
					className="pr-12 font-mono"
					error={errors.secretPin}
					touched={touched.secretPin}
					suffix={
						<button
							type="button"
							onClick={togglePinVisibility}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text hover:text-accent transition-colors duration-200"
							aria-label={showPin ? "Hide PIN" : "Show PIN"}>
							{showPin ? "Hide" : "Show"}
						</button>
					}
					aria-describedby={errors.secretPin ? "secretPin-error" : undefined}
					aria-invalid={touched.secretPin && !!errors.secretPin}
				/>

				<button
					type="submit"
					disabled={!isFormValid()}
					className={`w-full font-semibold py-3 px-6 rounded-md border-2 border-white transition-all duration-200 transform focus:ring-2 focus:ring-accent focus:outline-none ${
						isFormValid()
							? "bg-accent/90 text-white hover:bg-button hover:border-button-border hover:text-button-hover active:scale-[0.98] hover:shadow-lg"
							: "bg-accent/50 text-white/50 cursor-not-allowed border-white/50"
					}`}>
					Submit
				</button>
			</form>
		</div>
	);
}
