import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AppRegistrationOutlined } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link } from "react-router";
import {
	registerSchema,
	RegisterSchema,
} from "../../lib/schemas/registerSchema";

export default function RegisterForm() {
	const { registerUser } = useAccount();

	const {
		control,
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
		setError,
	} = useForm<RegisterSchema>({
		mode: "onTouched",
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterSchema) => {
		await registerUser.mutateAsync(data, {
			onError: (error) => {
				// will return an array of strings with error messages
				console.log(error)
				if (Array.isArray(error)) {
               error.forEach((err) => {
                  if (err.includes("Email")) setError("email", { message: err });
						else if (err.includes("DisplayName"))
							setError("displayName", { message: err });
                  else if (err.includes("Password"))
							setError("password", { message: err });
               });
				}
            console.log(errors)
			},
		});
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				display: "flex",
				flexDirection: "column",
				p: 3,
				gap: 3,
				maxWidth: "md",
				mx: "auto",
				borderRadius: 3,
			}}
		>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				gap={3}
				color="secondary.main"
			>
				<AppRegistrationOutlined fontSize="large" />
				<Typography variant="h4">Register</Typography>
			</Box>
			<TextInput label="Email" control={control} name="email" />
			<TextInput label="Display name" control={control} name="displayName" />
			<TextInput
				label="Password"
				control={control}
				name="password"
				type="password"
            helperText={errors.password?.message}
			/>
			<Button
				type="submit"
				disabled={!isValid || isSubmitting}
				variant="contained"
				size="large"
			>
				Register
			</Button>
			<Typography variant="body1" sx={{ textAlign: "center" }}>
				Already have an account?
				<Typography component={Link} to="/login" color="primary" sx={{ ml: 2 }}>
					Log in here!
				</Typography>
			</Typography>
		</Paper>
	);
}
