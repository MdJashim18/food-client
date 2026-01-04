import React, { useContext } from 'react';
import useAuth from '../../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../Provider/AuthProvider';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const { createUser, updateUser, setUser } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    

    const handleRegister = async (data) => {
        try {
            const uppercaseRegex = /[A-Z]/;
            const lowercaseRegex = /[a-z]/;

            if (!uppercaseRegex.test(data.password)) {
                toast.error("Password must contain at least one uppercase letter!");
                return;
            }
            if (!lowercaseRegex.test(data.password)) {
                toast.error("Password must contain at least one lowercase letter!");
                return;
            }

            
            await createUser(data.email, data.password);

            
            const formData = new FormData();
            formData.append('image', data.photo[0]);

            const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST}`;
            const imgRes = await axios.post(imageApiUrl, formData);
            const photoURL = imgRes.data.data.url;

            
            const userProfile = {
                displayName: data.name,
                photoURL: photoURL
            };

            await updateUser(userProfile);

          
            const userInfo = {
                email: data.email,
                displayName: data.name,
                photoURL,
                role: "user",
                createdAt: new Date()
            };

            const dbRes = await axiosSecure.post('/users', userInfo);

            if (dbRes.data.insertedId) {
                toast.success("User Registered Successfully!");
            }

            reset();
            navigate(location?.state || "/");

        } catch (err) {
            console.log(err);
            toast.error("Registration failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">

                <h2 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Join Food Lovers and start your journey
                </p>

                <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="label font-medium">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">Name is required</span>
                        )}
                    </div>

                   
                    <div>
                        <label className="label font-medium">Profile Photo</label>
                        <input
                            type="file"
                            {...register('photo', { required: true })}
                            className="file-input file-input-bordered w-full"
                        />
                        {errors.photo && (
                            <span className="text-red-500 text-sm">
                                Profile photo is required
                            </span>
                        )}
                    </div>

                    
                    <div>
                        <label className="label font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">Email is required</span>
                        )}
                    </div>

                   
                    <div>
                        <label className="label font-medium">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z]).+$/
                            })}
                            className="input input-bordered w-full"
                            placeholder="Enter your password"
                        />

                        {errors.password?.type === 'required' && (
                            <span className="text-red-500 text-sm">Password is required</span>
                        )}

                        {errors.password?.type === 'minLength' && (
                            <span className="text-red-500 text-sm">
                                Password must be at least 6 characters
                            </span>
                        )}

                        {errors.password?.type === 'pattern' && (
                            <span className="text-red-500 text-sm">
                                Must include uppercase & lowercase letters
                            </span>
                        )}
                    </div>

                    <button className="btn btn-neutral w-full mt-4">
                        Register
                    </button>
                </form>

                <p className="text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

                <ToastContainer />
            </div>
        </div>
    );
};

export default Register;
