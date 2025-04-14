import React, { useEffect, useState } from "react";
import "./Approvals.css";
import { urlAxios } from "../utils/urlAxios";

type ApprovaUser = {
    manufacturerName: string;
    id: string;
    manufacturerDescription: string;
    username: string;
    realname: string;
};
const Approvals = () => {
    const [approvalUsers, setApprovalUsers] = useState<ApprovaUser[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchUsers = async () => {
        try {
            const response = await urlAxios.get("/api/v1/admin/dashboard/pending");
            setApprovalUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const approveUser = async (userId: string) => {
        const confirm = window.confirm("이 사용자를 승인하시겠습니까?");
        if (!confirm) return;

        try {
            const response = urlAxios.patch(`/api/v1/admin/dashboard/${userId}/approve`);
            alert("승인이 완료되었습니다.");
            fetchUsers();
        } catch (e) {
            console.log(e);
        }
    };

    const rejectUser = async (userId: string) => {
        const confirm = window.confirm("이 사용자를 승인하시겠습니까?");
        if (!confirm) return;

        try {
            const response = urlAxios.patch(`/api/v1/admin/dashboard/${userId}/reject`);
            alert("거절이 완료되었습니다.");
            fetchUsers();
        } catch (e) {
            console.log(e);
        }
    };

    // const formatDate = (dateString) => {
    //   const date = new Date(dateString);
    //   return date.toLocaleDateString('ko-KR', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit'
    //   });
    // };

    const filteredUsers = approvalUsers!.filter(
        (user) =>
            // user.username!.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.realname?.toLowerCase().includes(searchTerm.toLowerCase()) || user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="approvals-container">
            <div className="approvals-header">
                <h1>가입 / 업체 승인</h1>
                <div className="header-underline"></div>
            </div>

            <div className="approvals-actions">
                <div className="search-container">
                    <input type="text" placeholder="이름, 회사명, 이메일 또는 주소로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="status-badge">
                    <span className="pending-badge">{approvalUsers.length}</span> 개의 승인 대기
                </div>
            </div>

            <div className="table-container">
                <table className="approvals-table">
                    <thead>
                        <tr>
                            <th>사용자명</th>
                            <th>실명</th>
                            <th>회사명</th>
                            {/* <th>주소</th>
                            <th>신청일</th> */}
                            <th>승인처리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.realname}</td>
                                    <td>{user.manufacturerName}</td>
                                    {/* <td className="address-cell">{user.address}</td> */}
                                    <td>
                                        <div className="action-buttons">
                                            <button className="approve-button" onClick={() => approveUser(user.id)}>
                                                승인
                                            </button>
                                            <button className="reject-button" onClick={() => rejectUser(user.id)}>
                                                거절
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row">
                                <td colSpan={7}>검색 결과가 없거나 승인 대기 중인 유저가 없습니다</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Approvals;
