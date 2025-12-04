import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import ProfilePage from "./ProfilePage/ProfilePage";
import LoginPage from "./LoginPage/LoginPage";
import Comments from "./Comments/Comments";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {

    return (
        <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace/>}/>

            {/* Защищенные маршруты */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage/>
                </ProtectedRoute>}
            />
            <Route path="/comments/:postId" element={
                <ProtectedRoute>
                    <Comments/>
                </ProtectedRoute>}
            />
        </Routes>
    )
}

export default AppRouter;
