import React, { useEffect, useState } from "react";
import "./Posts.css";
import { urlAxios } from "../utils/urlAxios";

export type Design = {
    id: string;
    author: AuthorInfo;
    name: string;
    description: string;
    rating: string;
    price: string;
    viewCount: string;
    downloadCount: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    modelFileUrl: string;
    purchased: boolean;
};

type AuthorInfo = {
    id: string;
    name: string;
    rating: string;
    introduction: string;
    modelCount: string;
    viewCount: string;
    profileImageUrl: string;
};

const Posts = () => {
    const [posts, setPosts] = useState<Design[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            const response = await urlAxios.get("/api/v1/model/user/list/popular");
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("이 3D 모델을 삭제하시겠습니까? 불법 또는 부적절한 콘텐츠인 경우 삭제해주세요.")) {
            try {
                const res = await urlAxios.delete(`/api/v1/model/author/admin/delete/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
                console.log(res.data);
                fetchPosts();
            } catch (error) {
                console.error("Error deleting post:", error);
            }
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

    const filteredPosts = posts.filter(
        (post) =>
            post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>3D 모델 콘텐츠 관리</h1>
                <div className="header-underline"></div>
            </div>

            <div className="posts-actions">
                <div className="search-container">
                    <input type="text" placeholder="제목, 설명 또는 작성자로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="count-info">
                    <span className="count-badge">{posts.length}</span> 3D 모델 콘텐츠
                </div>
            </div>

            <div className="table-container">
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>설명</th>
                            <th>작성자</th>
                            <th>업로드일</th>
                            <th>3D 모델</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.name}</td>
                                    <td className="description-cell">{post.description}</td>
                                    <td>{post.author.name}</td>
                                    <td>{"날짜 없어요"}</td>
                                    <td>
                                        <a href={post.modelFileUrl} className="view-model-btn" target="_blank" rel="noopener noreferrer">
                                            모델 확인
                                        </a>
                                    </td>
                                    <td>
                                        <button className="delete-button" onClick={() => handleDelete(post.id)} title="불법 또는 부적절한 콘텐츠 삭제">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row">
                                <td colSpan={6}>검색 결과가 없습니다</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Posts;
