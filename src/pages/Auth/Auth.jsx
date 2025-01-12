import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Auth = () => {
    const token = localStorage.getItem("x-auth-token");
    return token ? <Outlet /> : <Navigate replace to={'/signin'} />;
};

export default Auth;