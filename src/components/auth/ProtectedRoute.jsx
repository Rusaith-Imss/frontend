import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust the path if needed

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />; // Redirect if not logged in
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />; // Redirect if user lacks required role
    }

    return children;
};

export default ProtectedRoute;
