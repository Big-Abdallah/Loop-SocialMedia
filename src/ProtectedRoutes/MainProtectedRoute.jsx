import React from 'react'
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
export default function MainProtectedRoute({children}) {
    const { isLoggedin } = useContext(AuthContext);

    
    return isLoggedin ? children : <Navigate to={"/login"} replace />;
  
}
 