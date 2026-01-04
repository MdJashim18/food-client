import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, LogOut } = useContext(AuthContext);

    const links = (
        <>
            <li>
                <NavLink 
                    to='/' 
                    className={({ isActive }) => 
                        isActive 
                            ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300`
                            : `btn btn-ghost rounded-full  text-[#632EE3] font-semibold px-6 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent transition-all duration-300`
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to='/AllProducts' 
                    className={({ isActive }) => 
                        isActive 
                            ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold  shadow-lg transition-all duration-300`
                            : `btn btn-ghost rounded-full   text-[#632EE3] font-semibold px-6 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent transition-all duration-300`
                    }
                >
                    All Foods
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to='/Contact' 
                    className={({ isActive }) => 
                        isActive 
                            ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300`
                            : `btn btn-ghost rounded-full  text-[#632EE3] font-semibold px-6 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent transition-all duration-300`
                    }
                >
                    Contact
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to='/About' 
                    className={({ isActive }) => 
                        isActive 
                            ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300`
                            : `btn btn-ghost rounded-full  text-[#632EE3] font-semibold px-6 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent transition-all duration-300`
                    }
                >
                    About
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to='/addedCards' 
                    className={({ isActive }) => 
                        isActive 
                            ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-6 shadow-lg transition-all duration-300`
                            : `btn btn-ghost rounded-full  text-[#632EE3] font-semibold px-6 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent transition-all duration-300`
                    }
                >
                    Cards
                </NavLink>
            </li>
        </>
    );

    const handleLogOut = () => {
        LogOut().then(() => {
            toast("Wow Sign-out successful!");
        }).catch((error) => {
            console.log(error.message)
        });
    }

    return (
        <div className="navbar bg-base-100 shadow-sm w-[99%] mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1000] mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to='/' className="btn btn-ghost bg-gradient-to-r from-[#632EE3] to-[#9F62F2] bg-clip-text text-transparent text-xl font-bold">
                    Food Lovers
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {links}
                </ul>
            </div>

            <div className="navbar-end pr-5">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar group">
                            <div className="w-10 rounded-full ring-2 ring-[#632EE3] ring-offset-2 group-hover:ring-[#9F62F2] transition-all duration-300">
                                <img
                                    alt="User Profile"
                                    src={user.photoURL || "https://via.placeholder.com/100"}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <NavLink 
                                    to="/dashboard" 
                                    className={({ isActive }) => 
                                        isActive 
                                            ? `btn btn-ghost rounded-lg bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold justify-center mb-2`
                                            : `btn btn-ghost rounded-lg border-2 border-[#632EE3] text-[#632EE3] font-semibold justify-center mb-2 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogOut}
                                    className="btn btn-ghost rounded-lg border-2 border-[#008000] hover:bg-gradient-to-r hover:from-green-300 hover:to-green-600 hover:text-white hover:border-transparent text-[#008000] font-semibold justify-center"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <NavLink 
                        to="/login" 
                        className={({ isActive }) => 
                            isActive 
                                ? `btn rounded-full bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white font-semibold px-8 shadow-lg`
                                : `btn rounded-full border-2 border-[#632EE3] text-[#632EE3] font-semibold px-8 hover:bg-gradient-to-r hover:from-[#632EE3] hover:to-[#9F62F2] hover:text-white hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
                        }
                    >
                        Login
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Navbar;