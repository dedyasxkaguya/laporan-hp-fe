import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Classlink from "../../components/Classlink";
import "./Laporan.css"; // file CSS terpisah
export interface Data {
    id: number;
    student_class_id: number;
    teacher_id: number;
    date: Date;
    type: string;
    officer: string;
    image: string;
    created_at: Date;
    updated_at: Date;
    formatted_date: Date;
    is_today: boolean;
    student_class: StudentClass;
    teacher: Teacher;
}

export interface StudentClass {
    id: number;
    name: string;
    vocation: string;
    grade: string;
    created_at: Date;
    updated_at: Date;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}
interface ReportProps {
    type:string
}

const Laporan = ({ type }: ReportProps) => {
    const [data, setData] = useState<Data[]>([]);
    const [dateNow, setDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const apiLink = `http://127.0.0.1:8000/api/report/type/${type}`;

    useEffect(() => {
        axios.get<Data[]>(apiLink)
        .then(response => {
                setLoading(true);
                const fetched = response.data;
                setData(fetched);
                const dateArr = new Date().toLocaleDateString('id-ID', {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).split("/");
                const dateTemplate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
                setDate(dateTemplate);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [apiLink]);

    // Filter data berdasarkan search term (case insensitive)
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(item => 
            item.officer.toLowerCase().includes(term) ||
            item.teacher.name.toLowerCase().includes(term) ||
            `${item.student_class.grade} ${item.student_class.name}`.toLowerCase().includes(term) ||
            (item.formatted_date.toString().includes(term))
        );
    }, [data, searchTerm]);

    const getStatusBadge = (formattedDate: string) => {
        return formattedDate === dateNow ? 
            { text: "Sudah", className: "badge-success" } : 
            { text: "Belum", className: "badge-danger" };
    };

    return (
        <>
            <Navbar />
            <div className="laporan-container">
                <div className="laporan-card">
                    {/* Header */}
                    <div className="laporan-header">
                        <div>
                            <h1 className="laporan-title">
                                <i className="bi bi-clipboard-data me-3"></i>
                                Laporan {type} Gawai
                            </h1>
                            <p className="laporan-subtitle">
                                Daftar seluruh aktivitas {type.toLowerCase()} gawai
                            </p>
                        </div>
                        <div className="stats-badge">
                            <i className="bi bi-list-ul"></i>
                            <span>{filteredData.length} data</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="search-wrapper">
                        <div className="search-input-group">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan kelas, petugas, guru, atau tanggal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button 
                                    className="clear-search" 
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabel */}
                    <div className="table-responsive">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>Memuat data laporan...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-inbox"></i>
                                <p>Tidak ada data laporan {type}</p>
                                {searchTerm && <small>untuk pencarian "{searchTerm}"</small>}
                            </div>
                        ) : (
                            <table className="laporan-table">
                                <thead>
                                    <tr>
                                        <th>Kelas</th>
                                        <th>Nama Petugas</th>
                                        <th>Nama Guru</th>
                                        <th>Tanggal</th>
                                        <th>Status</th>
                                        <th>Foto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => {
                                        const status = getStatusBadge(item.formatted_date.toString());
                                        return (
                                            <tr key={item.id}>
                                                <td className="kelas-cell">
                                                    <Classlink 
                                                        grade={item.student_class.grade} 
                                                        name={item.student_class.name} 
                                                    />
                                                </td>
                                                <td className="officer-cell">{item.officer}</td>
                                                <td className="teacher-cell">{item.teacher.name}</td>
                                                <td className="date-cell">
                                                    <i className="bi bi-calendar3 me-2"></i>
                                                    {item.formatted_date.toString()}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${status.className}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td>
                                                    <a 
                                                        href={`http://127.0.0.1:8000/${item.image}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn-foto"
                                                    >
                                                        <i className="bi bi-camera-fill"></i>
                                                        Lihat Foto
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Laporan;