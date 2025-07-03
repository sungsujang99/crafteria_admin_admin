import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Delivery from "./pages/Delivery";
import Ads from "./pages/Ads";
import Approvals from "./pages/Approvals";
import Users from "./pages/Users";

function App() {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());

    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated());
        };

        checkAuth();
    }, []);

    return (
        <Router>
            <Routes>
                {/* 기본 경로 접근 시 login으로 */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 로그인 페이지 - 로그인 되어있으면 posts로 리디렉션 */}
                <Route path="/login" element={authenticated ? <Navigate to="/posts" replace /> : <Login />} />

                {/* 보호된 페이지 그룹 */}
                <Route path="/" element={authenticated ? <Dashboard /> : <Navigate to="/login" replace />}>
                    <Route path="posts" element={<Posts />} />
                    <Route path="users" element={<Users />} />
                    <Route path="approvals" element={<Approvals />} />
                    <Route path="delivery" element={<Delivery />} />
                    <Route path="ads" element={<Ads />} />
                    <Route path="*" element={<Navigate to="/posts" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
