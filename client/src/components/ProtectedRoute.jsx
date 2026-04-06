import { Navigate } from 'react-router-dom';

/* we often wrap those routes which shoudld not be accessed by unauthenticated users
 so check for the JWT token , if available , take user to protected pages 
 otherwise redirect to the login page*/

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
