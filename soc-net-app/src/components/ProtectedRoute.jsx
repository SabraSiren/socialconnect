import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from "./UI/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuth, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div>
                <Loader/>
            </div>
        );
    }

    return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;