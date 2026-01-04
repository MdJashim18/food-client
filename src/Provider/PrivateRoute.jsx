import React from 'react';
import { Navigate,  useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';

const PrivateRouter = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <span className="loading loading-dots loading-xl"></span>
    }
    if(!user){
        return <Navigate to='/login' state={location.pathname}></Navigate>
    }
    return children;
};

export default PrivateRouter;