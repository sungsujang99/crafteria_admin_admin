import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Delivery from "./pages/Delivery";
import Ads from "./pages/Ads";
import Approvals from "./pages/Approvals";
import Users from "./pages/Users";

function App() {
    const [authenticated, setAuthenticated] = useState(true);

    // Listen for authentication changes
    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated());
        };

        // Check initially and set up event listener
        checkAuth();

        // Add event listener for storage changes (logout from other tabs)
        window.addEventListener("storage", checkAuth);

        // Custom event for logout from this tab
        window.addEventListener("app:logout", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("app:logout", checkAuth);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Dashboard />}>
                    <Route index element={<Navigate to="posts" replace />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="users" element={<Users />} />
                    <Route path="approvals" element={<Approvals />} />
                    <Route path="delivery" element={<Delivery />} />
                    <Route path="ads" element={<Ads />} />
                    <Route path="*" element={<Navigate to="posts" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
