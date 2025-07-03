import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCredentials, setAuthenticated, isAuthenticated, isGloballyLocked, updatePassword } from "../utils/auth";
import "./Login.css";
import { urlAxios } from "../utils/urlAxios";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/posts", { replace: true });
            return;
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const loginData = {
            username,
            password,
        };
        try {
            const res = await urlAxios.post(`/api/v1/auth/login`, loginData);
            const data = res.data.data;
            console.log(data);
            setAuthenticated(true);
            localStorage.setItem("accessToken", data.accessToken);
            navigate("/posts", { replace: true });
        } catch (e: any) {
            alert("아이디 혹은 비밀번호를 확인해 주세요");
        }
        setIsLoading(false);
    };

    return (
        <div className="login-container" tabIndex={0}>
            <div className="login-card">
                <div className="login-header">
                    <h1>Crafteria Admin</h1>
                    <p>관리자 로그인</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">아이디</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디를 입력하세요" disabled={isLoading} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" disabled={isLoading} />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
                <div className="login-footer">
                    <p>© 2025 Crafteria. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
