import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { LoginSchema, loginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";

export default function LoginForm() {
	const { loginUser } = useAccount();
	const navigate = useNavigate();
	const location = useLocation();
	const {
		control,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm<LoginSchema>({
		mode: "onTouched",
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginSchema) => {
		await loginUser.mutateAsync(data, {
			onSuccess: () => {
				navigate(location.state?.from || "/activities");
			}
		}) // alternatively, can also use loading state from useMutation to disable button
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
			<Box display="flex" alignItems="center" justifyContent="center" gap={3} color='secondary.main'>
				<LockOpen fontSize="large"/>
				<Typography variant='h4'>Sign in</Typography>
			</Box>
			<TextInput label="Email" control={control} name="email" />
			<TextInput label="Password" control={control} name="password" type="password" />
			<Button
				type="submit"
				disabled={!isValid || isSubmitting}
				variant="contained"
				size="large"
			>
				Login
			</Button>
			<Typography variant="body1" sx={{ textAlign: "center"}}>
				Dont have an account?
				<Typography 
					component={Link}
					to='/register'
					color="primary"
					sx={{ml: 2}}
				>
					Sign up here!
				</Typography>
			</Typography>
		</Paper>
	);
}
