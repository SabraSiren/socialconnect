import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import ProfilePage from "./ProfilePage/ProfilePage";
import LoginPage from "./LoginPage/LoginPage";
import Comments from "./Comments/Comments";

const AppRouter = () => {
    const {isAuth} = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>

            <Route
                path="/profile"
                element={isAuth ? <ProfilePage/> : <Navigate to="/login" replace/>}
            />

            <Route
                path="/comments/:postId"
                element={isAuth ? <Comments/> : <Navigate to="/login" replace/>}
            />

            <Route
                path="/login"
                element={isAuth ? <Navigate to="/profile" replace/> : <LoginPage/>}
            />

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    )
};

export default AppRouter;
