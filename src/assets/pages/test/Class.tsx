import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Today from "../../components/Today";
import Navbar from "../../components/Navbar";
import Classlink from "../../components/Classlink";
import Daterow from "../../components/Daterow";
// import Status from "../../components/Status";

export interface Data {
    id: number;
    teacher_id: number;
    name: string;
    vocation: string;
    uuid: string;
    grade: string;
    created_at: Date;
    updated_at: Date;
    teacher: Teacher;
    latest_report: LatestReport | null;
}

export interface LatestReport {
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
}

export interface Teacher {
    id: number;
    class_name: string;
    name: string;
    uuid: string;
    classroom: string;
    created_at: Date;
    updated_at: Date;
}

const Class = () => {
    const [data, setData] = useState<Data[]>();
    const [report, setReport] = useState<number>(0);
    const [totalClasses, setTotalClasses] = useState<number>(0);
    const [kelasFilter, setKelas] = useState<string[]>(["X", "XI", "XII"]);
    const [jurusanFilter, setJurusan] = useState<string>("");
    const [statusFilter, setStatus] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const jurusanRef = useRef<HTMLSelectElement>(null);
    const kelasRef = useRef<HTMLSelectElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        axios
            .get<Data[]>("http://127.0.0.1:8000/api/class")
            .then((response) => {
                const fetched = response.data;
                setData(fetched);
                setTotalClasses(fetched.length);
                const reportCount = fetched.filter((a) => a.latest_report !== null).length;
                setReport(reportCount);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleResetFilter = () => {
        if (jurusanRef.current && kelasRef.current && statusRef.current) {
            jurusanRef.current.value = "";
            kelasRef.current.value = "";
            statusRef.current.value = "";
            setStatus("");
            setKelas(["X", "XI", "XII"]);
            setJurusan("");
        }
    };

    const handleKelas = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "") {
            setKelas(["X", "XI", "XII"]);
        } else {
            setKelas([value]);
        }
    };

    const handleJurusan = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setJurusan(e.target.value);
    };

    const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    // Custom styles for badges and table
    const customStyles = `
        .status-badge {
            padding: 0.35rem 0.75rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 500;
            display: inline-block;
            text-align: center;
            min-width: 100px;
        }
        .status-submitted {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-pickup {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-none {
            background-color: #f3f4f6;
            color: #4b5563;
        }
        .filter-card {
            background: #f9fafb;
            border-radius: 1rem;
            transition: all 0.2s ease;
        }
        .stats-card {
            transition: transform 0.2s ease;
        }
        .stats-card:hover {
            transform: translateY(-2px);
        }
        .table-hover-custom tbody tr:hover {
            background-color: #f8fafc;
            transition: background-color 0.2s ease;
        }
        .table thead th {
            border-bottom: 2px solid #e5e7eb;
            font-weight: 600;
            color: #1f2937;
        }
        @media (max-width: 768px) {
            .filter-controls {
                flex-direction: column;
                gap: 1rem;
            }
            .status-badge {
                min-width: 80px;
                font-size: 0.75rem;
            }
        }
    `;

    const getStatusBadgeClass = (type: string | null) => {
        if (type === "Pengumpulan") return "status-submitted";
        if (type === "Pengambilan") return "status-pickup";
        return "status-none";
    };

    const getStatusText = (type: string | null) => {
        if (type === "Pengumpulan") return "Pengumpulan";
        if (type === "Pengambilan") return "Pengambilan";
        return "Tidak ada";
    };

    return (
        <>
            <style>{customStyles}</style>
            <Navbar />
            <main className="container-fluid px-3 px-md-4 py-3">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-11">
                        {/* Main Card */}
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            {/* Header */}
                            <div className="card-header bg-white border-0 pt-4 pb-2 px-4">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                                            <i className="bi bi-building fs-4 text-primary"></i>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-0">Daftar Kelas SMKN 1 Jakarta</h5>
                                    </div>
                                    <Today />
                                </div>
                            </div>

                            <div className="card-body p-4 pt-2">
                                {/* Stats Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="stats-card bg-light rounded-3 p-3 h-100 d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-15 p-3 rounded-circle">
                                                <i className="bi bi-file-text fs-4 text-primary"></i>
                                            </div>
                                            <div>
                                                <p className="text-secondary mb-0 small">Total Laporan</p>
                                                <h3 className="fw-bold mb-0">{report}</h3>
                                                <small className="text-muted">Dari {totalClasses} kelas</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="stats-card bg-warning bg-opacity-10 rounded-3 p-3 h-100 d-flex align-items-center gap-3">
                                            <div className="bg-warning bg-opacity-20 p-3 rounded-circle">
                                                <i className="bi bi-clock-history fs-4 text-warning"></i>
                                            </div>
                                            <div>
                                                <p className="text-secondary mb-0 small">Belum Ada Laporan</p>
                                                <h3 className="fw-bold mb-0">{totalClasses - report}</h3>
                                                <small className="text-muted">Menunggu pengisian</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Section */}
                                <div className="filter-card p-3 p-md-4 mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <i className="bi bi-funnel fs-5 text-primary"></i>
                                        <span className="fw-semibold">Filter Data</span>
                                    </div>
                                    <div className="row g-3 align-items-end filter-controls">
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold small">Jurusan</label>
                                            <select
                                                className="form-select form-select-sm bg-white"
                                                onChange={handleJurusan}
                                                ref={jurusanRef}
                                            >
                                                <option value="">Semua Jurusan</option>
                                                <option value="Bangunan">Bangunan</option>
                                                <option value="Listrik">Listrik</option>
                                                <option value="Mesin">Mesin</option>
                                                <option value="Otomotif">Otomotif</option>
                                                <option value="Informatika">Informatika</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold small">Kelas</label>
                                            <select
                                                className="form-select form-select-sm bg-white"
                                                ref={kelasRef}
                                                onChange={handleKelas}
                                            >
                                                <option value="">Semua Kelas</option>
                                                <option value="X">X (Satu)</option>
                                                <option value="XI">XI (Dua)</option>
                                                <option value="XII">XII (Tiga)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold small">Status Laporan</label>
                                            <select
                                                className="form-select form-select-sm bg-white"
                                                ref={statusRef}
                                                onChange={handleStatus}
                                            >
                                                <option value="">Semua Status</option>
                                                <option value="Pengumpulan">Pengumpulan</option>
                                                <option value="Pengambilan">Pengambilan</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                                                onClick={handleResetFilter}
                                            >
                                                <i className="bi bi-arrow-repeat"></i>
                                                <span>Reset Filter</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                    <p className="fw-semibold mb-0">
                                        <i className="bi bi-table me-2"></i>Tabel Laporan Kelas
                                    </p>
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill small">
                                        <i className="bi bi-info-circle me-1"></i> Klik nama kelas untuk detail
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Memuat data kelas...</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-borderless align-middle table-hover-custom">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="fw-semibold py-3">Kelas</th>
                                                    <th className="fw-semibold py-3">Jurusan</th>
                                                    <th className="fw-semibold py-3">Wali Kelas</th>
                                                    <th className="fw-semibold py-3">Status</th>
                                                    <th className="fw-semibold py-3">Petugas</th>
                                                    <th className="fw-semibold py-3">Tanggal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data?.map((item) => {
                                                    const reportType = item.latest_report?.type ?? null;
                                                    const typeForFilter = reportType ?? "Tidak ada";

                                                    if (
                                                        kelasFilter.includes(item.grade) &&
                                                        item.vocation.toLowerCase().includes(jurusanFilter.toLowerCase()) &&
                                                        typeForFilter.toLowerCase().includes(statusFilter.toLowerCase())
                                                    ) {
                                                        return (
                                                            <tr key={item.id} className="border-bottom">
                                                                <td className="py-3">
                                                                    <Classlink grade={item.grade} name={item.name} />
                                                                </td>
                                                                <td className="py-3 text-secondary">{item.vocation}</td>
                                                                <td className="py-3 fw-semibold text-dark">
                                                                    {item.teacher.name}
                                                                </td>
                                                                <td className="py-3">
                                                                    <span
                                                                        className={`status-badge ${getStatusBadgeClass(
                                                                            reportType
                                                                        )}`}
                                                                    >
                                                                        {getStatusText(reportType)}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-capitalize text-secondary fw-medium">
                                                                    {item.latest_report ? (
                                                                        item.latest_report.officer.toLowerCase()
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 text-secondary">
                                                                    {item.latest_report ? (
                                                                        <Daterow date={item.latest_report.date.toString()} />
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                {data?.filter((item) => {
                                                    const reportType = item.latest_report?.type ?? null;
                                                    const typeForFilter = reportType ?? "Tidak ada";
                                                    return (
                                                        kelasFilter.includes(item.grade) &&
                                                        item.vocation.toLowerCase().includes(jurusanFilter.toLowerCase()) &&
                                                        typeForFilter.toLowerCase().includes(statusFilter.toLowerCase())
                                                    );
                                                }).length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-5 text-muted">
                                                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                            Tidak ada kelas yang sesuai dengan filter
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Class;