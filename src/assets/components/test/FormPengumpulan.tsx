import React, { useEffect, useRef, useState } from "react"
import Today from "../Today"
import axios from "axios"
import Swal from "sweetalert2"
import { Link, useNavigate } from "react-router-dom"
import "./FormPengumpulan.css" // ← file CSS tambahan

export interface Data {
    id: number
    name: string
    vocation: string
    grade: string
    created_at: Date
    updated_at: Date
}
export interface dataTeacher {
    id: number
    name: string
    email: string
    created_at: Date
    updated_at: Date
}


const FormPengumpulan = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const namaRef = useRef<HTMLInputElement>(null)
    const namaGuruRef = useRef<HTMLInputElement>(null)
    const namaGuruRef1 = useRef<HTMLSelectElement>(null)
    const namaGuruRef2 = useRef<HTMLSelectElement>(null)
    const kelasRef = useRef<HTMLSelectElement>(null)
    const laporanRef = useRef<HTMLSelectElement>(null)
    const navigate = useNavigate()

    const namGuruArr = [namaGuruRef, namaGuruRef1, namaGuruRef2]
    const [dataTeacher, detDataTeacher] = useState<dataTeacher[]>()
    const [photoBlob, setPhotoBlob] = useState<Blob>()
    const [photoUrl, setPhoto] = useState<string | boolean>(false)
    const [isLaporan, setLaporan] = useState<boolean | number>(false)
    const [isModal, setModal] = useState<boolean>(false)
    const [isSend, setSend] = useState<boolean>(false)
    //checking
    const [isNamaValid, setNamaValid] = useState<boolean>(false)
    const [isKelasValid, setKelasValid] = useState<boolean>(false)
    const [isImageValid, setImageValid] = useState<boolean>(false)
    const [isBentukValid, setBentukValid] = useState<boolean>(false)

    const [classes, setClasses] = useState<Data[]>()
    let progress: number = 0
    progress = isNamaValid ? progress += 25 : progress += 0
    progress = isKelasValid ? progress += 25 : progress += 0
    progress = isImageValid ? progress += 25 : progress += 0
    progress = isBentukValid ? progress += 25 : progress += 0

    const takePhoto = () => {
        startWebcam()
        const video = videoRef.current
        const canvas = canvasRef.current
        if (video && canvas) {
            canvas.width = 640
            canvas.height = 360
            const context = canvas.getContext("2d")
            if (context) {
                context.drawImage(video, 0, 0, 640, 360)
                const dataUrl = canvas.toDataURL('image/webp')
                if (dataUrl !== 'data:,') {
                    setPhoto(canvas.toDataURL('image/webp'))
                    canvas.toBlob(blob => {
                        console.log(blob)
                        if (blob) {
                            setPhotoBlob(blob)
                        }
                    }, 'image/webp')
                    setModal(false)
                    setImageValid(true)
                } else {
                    console.log("ini kosong")
                }
            }
        }
    }
    const startWebcam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                video: {
                    height: 360,
                    width: 640
                },
                audio: false
            }
        )
        setTimeout(() => {
            try {
                const video = videoRef.current
                if (video) {
                    video.srcObject = stream
                } else {
                    console.log("Gagal", video)
                }
            } catch (err) {
                console.log(err)
            }
        }, 512)
    }
    useEffect(() => {
        axios.get<dataTeacher[]>("http://127.0.0.1:8000/api/teacher")
            .then(data => {
                const fetched = data.data
                detDataTeacher(fetched)
            })
        axios.get<Data[]>("http://127.0.0.1:8000/api/class")
            .then(data => {
                const fetched = data.data
                if (fetched) {
                    setClasses(fetched)
                }
            })
        startWebcam()
    }, [])
    const openModal = () => {
        startWebcam()
        setModal(true)
    }
    const closeModal = () => {
        startWebcam()
        setModal(false)
    }
    const handleNama = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value == "") {
            setNamaValid(false)
        } else {
            setNamaValid(true)
        }
    }
    const handleKelas = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKelasValid(true)
        const value = e.target.value
        console.log(value)
    }
    const handleBentuk = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBentukValid(true)
        const value: number = Number(e.target.value)
        setLaporan(value)
        setTimeout(() => {
            console.log(namGuruArr[value].current)
        }, 1000)
    }
    const handleReset = () => {
        if (namaRef.current && kelasRef.current && laporanRef.current) {
            namaRef.current.value = ''
            kelasRef.current.value = ''
            laporanRef.current.value = ''
            setNamaValid(false)
            setKelasValid(false)
            setBentukValid(false)
            setImageValid(false)
            setPhoto(false)
        } else {
            console.log("gagal")
        }
    }
    const handleSubmit = () => {
        setSend(true)
        Swal.fire({
            title: "Wait a second...",
            text: "Fetching our API",
            showConfirmButton: false,
        })
        if (namaRef.current && kelasRef.current && laporanRef.current) {
            const namaValue = namaRef.current.value
            const kelasValue = kelasRef.current.value
            const laporanValue: number = Number(laporanRef.current.value)
            if (progress == 100) {

                if (namaValue && kelasValue && laporanValue && photoUrl) {
                    if (namGuruArr[laporanValue].current) {
                        const namaGuru = namGuruArr[laporanValue].current.value

                        const formData = new FormData
                        formData.append("officer", namaValue)
                        formData.append("class_id", kelasValue)
                        formData.append("image", photoBlob as Blob)
                        formData.append("type", laporanValue == 1 ? "Pengumpulan" : "Pengambilan")
                        formData.append("teacher", namaGuru)
                        try {
                            axios.post("http://127.0.0.1:8000/api/report", formData,)
                                .then(data => {
                                    const fetched = data.data
                                    console.log(fetched)
                                    if (fetched) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: "Sukses",
                                            text: "Berhasil menambahkan laporanmu",
                                            timer: 2440,
                                            timerProgressBar: true,
                                            showConfirmButton: false
                                        })
                                        setTimeout(() => {
                                            navigate(0)
                                            setSend(false)
                                        }, 2000)
                                    }
                                })
                        } catch (err) {
                            console.log(err)
                            setSend(false)
                        }
                    }
                }
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Mohon maaf",
                    text: "Lengkapi form sebelum mengirim",
                    toast: true,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                })
                setTimeout(() => {
                    setSend(false)
                }, 2560)
                // setSend(false)
            }
        }
    }

    return (
        <div className="form-pengumpulan-container">
            <div className="form-card">
                {/* Header dengan sentuhan modern */}
                <div className="card-header-custom">
                    <div>
                        <h1 className="greeting">
                            Halo, <span>Selamat Datang</span>
                        </h1>
                        <span className="hashtag-badge">
                            <i className="bi bi-hash"></i>BijakBergawai
                        </span>
                    </div>
                    <div className="today-wrapper">
                        <Today />
                    </div>
                </div>

                <form>
                    <p className="form-subtitle">
                        <i className="bi bi-pencil-square me-2"></i>
                        Form pengumpulan Gawai
                    </p>

                    {/* Input Nama Petugas */}
                    <div className="input-group-custom">
                        <label htmlFor="nama">
                            <i className="bi bi-person-badge"></i> Nama Petugas
                        </label>
                        <input
                            type="text"
                            id="nama"
                            placeholder="Masukkan nama petugas..."
                            onChange={handleNama}
                            ref={namaRef}
                            className="custom-input"
                        />
                    </div>

                    {/* Pilih Kelas */}
                    <div className="input-group-custom">
                        <label htmlFor="kelas">
                            <i className="bi bi-grid-3x3-gap-fill"></i> Pilih Kelas
                        </label>
                        <select
                            id="kelas"
                            defaultValue="default"
                            onChange={handleKelas}
                            ref={kelasRef}
                            className="custom-select"
                        >
                            <option value="default" disabled hidden>
                                Pilih Kelas
                            </option>
                            {classes?.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.grade} {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bentuk Laporan */}
                    <div className="input-group-custom">
                        <label htmlFor="laporan">
                            <i className="bi bi-file-earmark-text"></i> Bentuk laporan
                        </label>
                        <select
                            id="laporan"
                            defaultValue="default"
                            onChange={handleBentuk}
                            ref={laporanRef}
                            className="custom-select"
                        >
                            <option value="default" disabled hidden>
                                Pilih bentuk
                            </option>
                            <option value={1}>Pengumpulan</option>
                            <option value={2}>Pengambilan</option>
                        </select>
                    </div>

                    {/* Nama Guru (dinamis) */}
                    {!isLaporan && (
                        <div className="input-group-custom disabled">
                            <label>
                                <i className="bi bi-person-video3"></i> Nama Guru
                            </label>
                            <input
                                type="text"
                                disabled
                                placeholder="Pilih bentuk laporan dulu..."
                                className="custom-input"
                            />
                        </div>
                    )}

                    {isLaporan === 1 && (
                        <div className="input-group-custom">
                            <label htmlFor="namaGuru1">
                                <i className="bi bi-person-workspace"></i> Nama Guru (Pengumpulan)
                            </label>
                            <select
                                id="namaGuru1"
                                defaultValue="default"
                                ref={namaGuruRef1}
                                className="custom-select"
                            >
                                <option value="default" disabled hidden>
                                    Pilih Guru
                                </option>
                                {dataTeacher?.map((a) => (
                                    <option key={a.id} value={a.id} className="text-capitalize">
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isLaporan === 2 && (
                        <div className="input-group-custom">
                            <label htmlFor="namaGuru2">
                                <i className="bi bi-person-down"></i> Nama Guru (Pengambilan)
                            </label>
                            <select
                                id="namaGuru2"
                                defaultValue="default"
                                ref={namaGuruRef2}
                                className="custom-select"
                            >
                                <option value="default" disabled hidden>
                                    Pilih Guru
                                </option>
                                {dataTeacher?.map((a) => (
                                    <option key={a.id} value={a.id} className="text-capitalize">
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Bagian Ambil Foto - Desain Baru */}
                    <div className="photo-section">
                        <div className="photo-header">
                            <i className="bi bi-camera-fill"></i>
                            <span>Ambil foto</span>
                        </div>

                        <div className="photo-content">
                            <canvas ref={canvasRef} hidden></canvas>

                            {typeof photoUrl === "string" ? (
                                <>
                                    <div className="photo-preview">
                                        <img
                                            src={photoUrl}
                                            alt="Hasil Foto"
                                            style={{ transform: "scaleX(-1)" }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-retake"
                                        onClick={openModal}
                                    >
                                        <i className="bi bi-arrow-repeat"></i> Ambil Ulang
                                    </button>
                                </>
                            ) : (
                                <div className="photo-placeholder" onClick={openModal}>
                                    <i className="bi bi-camera"></i>
                                    <span>Belum mengambil gambar</span>
                                    <button type="button" className="btn-camera">
                                        <i className="bi bi-webcam-fill"></i> Buka Kamera
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar yang lebih stylish */}
                    <div className="progress-section">
                        <div className="progress-header">
                            <span>Progress pengisian</span>
                            <span className="progress-value">{progress}%</span>
                        </div>
                        <div className="progress-bar-custom">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="action-buttons">
                        <button
                            type="button"
                            className="btn-primary-custom"
                            onClick={handleSubmit}
                            disabled={isSend}
                        >
                            <i className="bi bi-send-fill"></i> Kirim Laporan
                        </button>
                        <button
                            type="button"
                            className="btn-secondary-custom"
                            onClick={handleReset}
                        >
                            <i className="bi bi-arrow-counterclockwise"></i> Reset
                        </button>
                    </div>

                    {/* Navigasi Halaman */}
                    <div className="navigation-links">
                        <span>Pindah ke halaman</span>
                        <div className="nav-buttons">
                            <Link to="/pengumpulan" className="nav-link">
                                Pengumpulan <i className="bi bi-chevron-right"></i>
                            </Link>
                            <Link to="/pengambilan" className="nav-link">
                                Pengambilan <i className="bi bi-chevron-right"></i>
                            </Link>
                            <Link to="/kelas" className="nav-link">
                                Lihat Kelas <i className="bi bi-chevron-right"></i>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* Modal Kamera - Desain overlay yang lebih halus */}
            {isModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Ambil Foto</h3>
                        <div className="video-container">
                            <video
                                ref={videoRef}
                                playsInline
                                autoPlay
                                style={{ transform: "scaleX(-1)" }}
                            ></video>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-modal-cancel" onClick={closeModal}>
                                <i className="bi bi-x-circle"></i> Batal
                            </button>
                            <button className="btn-modal-capture" onClick={takePhoto}>
                                <i className="bi bi-camera-fill"></i> Jepret Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormPengumpulan