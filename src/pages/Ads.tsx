import React, { useEffect, useState } from "react";
import "./Ads.css";
import { urlAxios } from "../utils/urlAxios";

type Ad = {
    id: number;
    title?: string; // title이 선택적 속성임을 명시
    imageUrl: string;
    linkUrl?: string; // linkUrl이 선택적 속성임을 명시
};

const Ads = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [newAdForm, setNewAdForm] = useState({
        name: "",
        linkUrl: "",
    });

    const fetchAds = async () => {
        try {
            const response = await urlAxios.get("/api/v1/advertisement-images");
            console.log(response.data.data);
            setAds(response.data.data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewAdForm({
            ...newAdForm,
            [name]: value,
        });
    };

    // Handle ad upload
    const handleAdUpload = async () => {
        if (!selectedFile) {
            alert("광고 이미지를 선택해주세요.");
            return;
        }

        if (!newAdForm.name || !newAdForm.linkUrl) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("imageFile", selectedFile);

            const url = `/api/v1/advertisement-images?title=${newAdForm.name}&linkurl=${newAdForm.linkUrl}`;
            console.log(url);

            await urlAxios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchAds();
            alert("광고가 성공적으로 등록되었습니다.");
        } catch (error) {
            console.error("Error uploading ad:", error);
        }
        // Reset form
        setSelectedFile(null);
        setFilePreview(null);
        setNewAdForm({
            name: "",
            linkUrl: "",
        });
    };

    // Delete an ad
    const handleDeleteAd = async (adId: number) => {
        if (window.confirm("이 광고를 삭제하시겠습니까?")) {
            try {
                await urlAxios.delete(`/api/v1/advertisement-images/${adId}`);
                fetchAds();
                alert("광고가 삭제되었습니다.");
            } catch (error) {
                console.error("Error deleting ad:", error);
            }
        }
    };

    // Filter ads based on search term
    const filteredAds = ads.filter((ad) => {
        const title = ad.title?.toLowerCase() || "";
        const linkUrl = ad.linkUrl?.toLowerCase() || "";
        return title.includes(searchTerm.toLowerCase()) || linkUrl.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="ads-container">
            <div className="ads-header">
                <h1>광고 관리</h1>
                <div className="header-underline"></div>
            </div>

            <div className="ads-sections">
                {/* Left section - Upload and form */}
                <div className="ads-upload-section">
                    <h2>새 광고 등록</h2>

                    <div className="upload-preview">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" />
                        ) : (
                            <div className="empty-preview">
                                <span>이미지 미리보기</span>
                            </div>
                        )}
                    </div>

                    <div className="file-upload">
                        <label className="file-label">
                            <span>이미지 선택</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                        </label>
                        {selectedFile && <span className="file-name">{selectedFile.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>광고 이름</label>
                        <input type="text" name="name" value={newAdForm.name} onChange={handleFormChange} placeholder="광고 이름을 입력하세요" />
                    </div>

                    <div className="form-group">
                        <label>링크 URL</label>
                        <input type="url" name="linkUrl" value={newAdForm.linkUrl} onChange={handleFormChange} placeholder="https://www.example.com" />
                    </div>

                    <button className="upload-button" onClick={handleAdUpload}>
                        광고 등록하기
                    </button>
                </div>

                {/* Right section - Existing ads */}
                <div className="ads-list-section">
                    <div className="ads-actions">
                        <div className="search-container">
                            <input type="text" placeholder="이름 또는 URL로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                            <span className="search-icon">🔍</span>
                        </div>
                        <div className="ads-count">
                            총 <span className="count-number">{filteredAds.length}</span>개의 광고
                        </div>
                    </div>

                    <div className="ads-grid">
                        {filteredAds.length > 0 ? (
                            filteredAds.map((ad) => (
                                <div className="ad-card" key={ad.id}>
                                    <div className="ad-image">
                                        <img src={ad.imageUrl} alt={ad.title} />
                                    </div>
                                    <div className="ad-info">
                                        <h3>{ad.title}</h3>
                                        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="ad-link">
                                            {ad.linkUrl}
                                        </a>
                                        <button className="delete-button" onClick={() => handleDeleteAd(ad.id)}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-ads">
                                <p>등록된 광고가 없거나 검색 결과가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ads;
