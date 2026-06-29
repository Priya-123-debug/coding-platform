import React from 'react'
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4' // use for schema validation for signup form
import { loginuser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
const signupSchema = z.object({

	emailid: z.string().email(),
	password: z.string().min(8, "password should contain atleast 8 character ")

});

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [justLoggedIn, setJustLoggedIn] = useState(false);
	const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);
	// console.log("Auth state:", { user, isAuthenticated, loading });

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({ resolver: zodResolver(signupSchema) });
	useEffect(() => {
		

		if (isAuthenticated && user) {
			// console.log(user)
			if (user?.role === "admin") {
				navigate("/admin"); // redirect admin to admin panel
			} else {
				navigate("/"); // redirect regular user to homepage
			}
		}
	}, [isAuthenticated, navigate, user]);
	const onSubmit = (data) => {
		// console.log("Form Data:", data);
		dispatch(loginuser(data));
	};

	const fillAdmin = () => {
		setValue("emailid", "supriyak.ug23.ec@nitp.ac.in");
		setValue("password", "12345678");
	};

	const fillUser = () => {
		setValue("emailid", "test@test.com");
		setValue("password", "12345678");
	};

	

	return (


		<div className=' flex flex-col items-center justify-center '>


			<form onSubmit={handleSubmit(onSubmit)} className=' mt-10 h-150 flex flex-col  bg-white p-10 rounded-lg shadow-lg border border-gray-200  justify-center items-center gap-y-6 w-full max-w-xl ml-10'>
				<h1 className='flex justify-center text-[50px] mb-12 text-black'> Login </h1>


				<input {...register("emailid")} type="email" placeholder="Enter Email" className='border border-gray-300 rounded p-2 w-full text-black' />
				{errors.emailid && <span className='text-red-500'>{errors.emailid.message}</span>}

				<div className="relative w-full">
					<input
						{...register("password")}
						type={showPassword ? "password" : "text"}
						placeholder="Enter Password"
						className="border border-gray-300 rounded p-2 w-full text-black pr-10"
					/>
					<span
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
					>
						<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
					</span>
					{errors.password && (
						<span className="text-red-500">{errors.password.message}</span>
					)}
				</div>

				<div className="flex w-full gap-3">
					<button type="button" onClick={fillAdmin} className="btn btn-sm flex-1">
						Fill admin sample
					</button>
					<button type="button" onClick={fillUser} className="btn btn-sm flex-1">
						Fill user sample
					</button>
				</div>

				<button type="submit" className="btn w-100">Submit</button>
				<p className='text-black mt-4'>
					Do not  have an account?{' '}

					<span className='text-blue-600 cursor-pointer underline'
						onClick={() => navigate('/signup')}>Sign up
					</span>

				</p>
			</form>
		</div>

	)
}

export default Login