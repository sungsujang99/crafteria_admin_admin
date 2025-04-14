import React, { useEffect, useState } from "react";
import "./Users.css";
import { urlAxios } from "../utils/urlAxios";

type User = {
    id: string;
    username: string;
    realname: string;
    oauth2Id: string;
    role: string;
    address: string;
};
const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await urlAxios.get("/api/v1/users");
            setUsers(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBanUser = async (id: string) => {
        const confirm = window.confirm("정말 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
        if (!confirm) return;

        try {
            const res = await urlAxios.post(`/api/v1/users/${id}/ban?until=${"2028-01-01"}`);
            fetchUsers;
        } catch (e) {
            console.log(e);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <span className="role-badge admin">관리자</span>;
            case "DASHBOARD":
                return <span className="role-badge dashboard">제조사</span>;
            default:
                return <span className="role-badge user">일반회원</span>;
        }
    };

    const filteredUsers = users.filter((user) => user.realname.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>회원 목록</h1>
                <div className="header-underline"></div>
            </div>

            <div className="users-actions">
                <div className="search-container">
                    <input type="text" placeholder="아이디 또는 주소로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="count-info">
                    <span className="count-badge">{users.length}</span> 회원
                </div>
            </div>

            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>주소</th>
                            <th>역할</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username || user.oauth2Id}</td>
                                    <td>{user.realname}</td>
                                    <td className="address-cell">{user.address}</td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>
                                        <button className="delete-button" onClick={() => handleBanUser(user.id)} title="회원 삭제">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row">
                                <td colSpan={4}>검색 결과가 없습니다</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
