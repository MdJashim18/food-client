import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from '../../../../Provider/AuthProvider';

const Login = () => {
    const { LogIn, SignInWithGoogle} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        LogIn(email, password)
            .then(result => {
                console.log(result.user);
                toast.success("Login successful!");
                navigate(`${location.state? location.state : "/"}`)
            })
            .catch(error => {
                console.error(error.message);
                toast.error("Login failed! Please check your credentials.");
            });
    };

    const handleGoogleSignIn = () => {
        SignInWithGoogle()
            .then(result => {
                console.log(result.user);
                toast.success("Login with Google successful!");
                navigate(location.state?.from || "/");
            })
            .catch(error => {
                console.error(error.message);
                toast.error("Google sign-in failed!");
            });
    };

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl py-5">
                <h2 className='font-semibold text-2xl text-center'>Login your account</h2>
                <form onSubmit={handleLogin}>
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input type="email" className="input" name='email' placeholder="Email" required />
                            <label className="label">Password</label>
                            <input type="password" className="input" name='password' placeholder="Password" required />

                            <button className="btn btn-neutral mt-4">Login</button>
                            <button 
                                type="button"
                                className="btn btn-secondary btn-outline w-full flex items-center justify-center gap-2 mt-2"
                                onClick={handleGoogleSignIn}
                            >
                                <FcGoogle size={24} /> Login with Google
                            </button>

                            <p className='font-semibold text-center pt-5'>
                                Don't Have An Account? 
                                <Link className='text-secondary' to="/register"> Register</Link>
                            </p>
                        </fieldset>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;