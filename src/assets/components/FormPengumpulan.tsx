import React, { useEffect, useRef, useState } from "react"
import Today from "./Today"
import axios from "axios"
import Swal from "sweetalert2"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
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
    const phoneRef = useRef<HTMLInputElement>(null)
    const namaGuruRef = useRef<HTMLInputElement>(null)
    const notesRef = useRef<HTMLInputElement>(null)
    const namaGuruRef1 = useRef<HTMLSelectElement>(null)
    const namaGuruRef2 = useRef<HTMLSelectElement>(null)
    const namaGuruRef3 = useRef<HTMLSelectElement>(null)
    const kelasRef = useRef<HTMLSelectElement>(null)
    const laporanRef = useRef<HTMLSelectElement>(null)
    const navigate = useNavigate()

    const namGuruArr = [namaGuruRef, namaGuruRef1, namaGuruRef2, namaGuruRef3]
    const [dataTeacher, detDataTeacher] = useState<dataTeacher[]>()
    const [photoBlob, setPhotoBlob] = useState<Blob>()
    const [photoUrl, setPhoto] = useState<string | boolean>(false)
    const [isLaporan, setLaporan] = useState<boolean | number>(false)
    const [isModal, setModal] = useState<boolean>(false)
    const [isSend, setSend] = useState<boolean>(false)
    //checking
    const [isNamaValid, setNamaValid] = useState<boolean>(false)
    const [isPhoneValid, setPhoneValid] = useState<boolean>(false)
    const [isKelasValid, setKelasValid] = useState<boolean>(false)
    const [isImageValid, setImageValid] = useState<boolean>(false)
    const [isBentukValid, setBentukValid] = useState<boolean>(false)

    const [classes, setClasses] = useState<Data[]>()
    let progress: number = 0
    progress = isNamaValid ? progress += 20 : progress += 0
    progress = isPhoneValid ? progress += 20 : progress += 0
    progress = isKelasValid ? progress += 20 : progress += 0
    progress = isImageValid ? progress += 20 : progress += 0
    progress = isBentukValid ? progress += 20 : progress += 0

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
    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value == "") {
            setPhoneValid(false)
        } else {
            setPhoneValid(true)
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
        if (namaRef.current && kelasRef.current && laporanRef.current && phoneRef.current) {
            namaRef.current.value = ''
            kelasRef.current.value = ''
            laporanRef.current.value = ''
            phoneRef.current.value = ''
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
        if (namaRef.current && kelasRef.current && laporanRef.current && phoneRef.current) {
            const namaValue = namaRef.current.value
            const kelasValue = kelasRef.current.value
            const laporanValue: number = Number(laporanRef.current.value)
            const phoneValue = phoneRef.current.value
            const notesValue = notesRef.current?.value ? notesRef.current.value : null
            if (progress == 100) {
                if (namaValue && kelasValue && laporanValue && photoUrl) {
                    if (namGuruArr[laporanValue].current) {
                        const namaGuru = namGuruArr[laporanValue].current.value
                        const formData = new FormData
                        formData.append("officer", namaValue)
                        formData.append("class_id", kelasValue)
                        formData.append("image", photoBlob as Blob)
                        formData.append("type", laporanValue == 1 ? "Pengumpulan" : laporanValue == 2 ? "Pengambilan" : "Peminjaman")
                        formData.append("teacher", namaGuru)
                        formData.append("phone", phoneValue)
                        formData.append("notes", notesValue as string)
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
        <>
            <Navbar />
            <section className=" mt-4 d-flex flex-column gap-2 p-3">
                <p className="text-secondary fw-semibold my-2">
                    <i className="bi bi-pencil-square me-2"></i><span>Form Pengumpulan Gawai</span>
                </p>
                <Today />
                <div className=" mb-2">
                    <label htmlFor="nama" className=" form-label fw-semibold text-primary">
                        <i className="bi bi-person-badge me-2"></i><span>Nama Petugas</span>
                    </label>
                    <input type="text" name="nama" id="nama" className=" form-control" autoFocus onChange={(e) => handleNama(e)} ref={namaRef} />
                </div>
                <div className=" mb-2">
                    <label htmlFor="kelas" className=" form-label fw-semibold text-primary">
                        <i className="bi bi-grid-3x3-gap-fill me-2"></i><span>Pilih Kelas</span>
                    </label>
                    <select name="kelas" id="kelas" className=" form-select" onChange={(e) => handleKelas(e)} ref={kelasRef}>
                        <option value="default" selected hidden>Pilih Kelas</option>
                        {classes && (
                            classes.map(a => {
                                return (
                                    <option value={a.id}>{a.grade} {a.name}</option>
                                )
                            })
                        )}
                    </select>
                </div>
                <div className=" mb-2">
                    <label htmlFor="laporan" className=" form-label fw-semibold text-primary">
                        <i className="bi bi-file-earmark-text-fill me-2"></i><span>Bentuk laporan</span>
                    </label>
                    <select name="laporan" id="laporan" className=" form-select" onChange={(e) => handleBentuk(e)} ref={laporanRef}>
                        <option value="default" selected hidden>Pilih bentuk</option>
                        <option value={1}>Pengumpulan</option>
                        <option value={2}>Pengambilan</option>
                        <option value={3}>Peminjaman</option>
                    </select>
                </div>
                {!isLaporan && (
                    <div className=" mb-2">
                        <label htmlFor="disabled" className=" form-label fw-semibold text-primary">
                            <i className="bi bi-person-video3 me-2"></i>
                            <span>Nama Guru</span>
                        </label>
                        <input type="text" name="disabled" id="disabled" className=" form-control"
                            onChange={(e) => handleNama(e)} ref={namaGuruRef} disabled />
                    </div>
                )}
                {isLaporan == 1 && (
                    <div className=" mb-2">
                        <label htmlFor="namaGuru1" className=" form-label fw-semibold text-primary">
                            <i className="bi bi-person-video3 me-2"></i>
                            <span>Nama Guru Pertama</span>
                        </label>
                        <select name="namaGuru1" id="namaGuru1" ref={namaGuruRef1} className=" form-select">
                            <option value="default" selected hidden>Pilih Guru</option>
                            {dataTeacher?.map((a) => {
                                return (
                                    <option value={a.id} className=" text-capitalize">{a.name}</option>
                                )
                            })}
                        </select>
                    </div>
                )}
                {isLaporan == 2 && (
                    <div className=" mb-2">
                        <label htmlFor="namaGuru2" className=" form-label fw-semibold text-primary">
                            <i className="bi bi-person-video3 me-2"></i>
                            <span>Nama Guru Terakhir</span>
                        </label>
                        <select name="namaGuru2" id="namaGuru2" ref={namaGuruRef2} className="form-select">
                            <option value="default" selected hidden>Pilih Guru</option>
                            {dataTeacher?.map((a) => {
                                return (
                                    <option value={a.id} className=" text-capitalize">{a.name}</option>
                                )
                            })}
                        </select>
                    </div>
                )}
                {isLaporan == 3 && (
                    <div className=" mb-2">
                        <label htmlFor="namaGuru3" className=" form-label fw-semibold text-primary">
                            <i className="bi bi-person-video3 me-2"></i>
                            <span>Nama Guru Penanggung-Jawab</span>
                        </label>
                        <select name="namaGuru3" id="namaGuru3" ref={namaGuruRef3} className="form-select">
                            <option value="default" selected hidden>Pilih Guru</option>
                            {dataTeacher?.map((a) => {
                                return (
                                    <option value={a.id} className=" text-capitalize">{a.name}</option>
                                )
                            })}
                        </select>
                    </div>
                )}
                {isLaporan == 3 && (
                    <div className=" mb-2">
                        <label htmlFor="namaGuru3" className=" form-label fw-semibold text-primary">
                            <i className="bi bi-person-video3 me-2"></i>
                            <span>Catatan Peminjaman</span>
                        </label>
                        <input type="text" name="" id="" className=" form-control" ref={notesRef} />
                    </div>
                )}
                <div className=" mb-2">
                    <label htmlFor="handphone" className=" form-label fw-semibold text-primary">
                        <i className="bi bi-phone me-2"></i><span>Jumlah Handphone</span>
                    </label>
                    <input type="number" name="handphone" id="handphone" className=" form-control" onChange={(e) => handlePhone(e)} ref={phoneRef}
                        min={1} max={36} />
                </div>
                <div className=" mb-2 ">
                    <label htmlFor="foto" className=" form-label fw-semibold text-primary">
                        {isImageValid && (
                            <>
                                <i className="bi bi-person-check me-2"></i>
                                <span>Ambil foto</span>
                            </>
                        )}
                        {!isImageValid && (
                            <>
                                <i className="bi bi-person-bounding-box me-2"></i>
                                <span>Ambil foto</span>
                            </>
                        )}
                    </label>
                    <br />
                    {isImageValid && (
                        <p className=" text-secondary m-0">Hasil : </p>
                    )}
                    <div className=" rounded-4 shadow-sm border p-3">
                        <canvas ref={canvasRef} hidden></canvas>
                        {typeof (photoUrl) == "string" && (
                            <>
                                <img src={photoUrl} alt="" className="rounded-4 shadow w-100
                                " style={{ transform: "scaleX(-1)" }} />
                                <br />
                            </>
                        )}
                        {typeof (photoUrl) == "boolean" && (
                            <>
                                <p className=" m-0 text-secondary">Belum mengambil gambar</p>
                                <button type="button" className="mt-2 btn btn-primary" onClick={() => openModal()}>
                                    <span>Kamera</span>
                                    <i className="bi bi-webcam-fill mx-2"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className=" mb-4 mt-4">
                    <p>Progress : <span className=" text-secondary">{progress}%</span></p>
                    <div className="progress" role="progressbar" aria-label="Success example" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className=" d-flex gap-2 ">
                    <button type="button" className=" btn btn-primary" onClick={() => handleSubmit()} disabled={isSend}>
                        <span>Kirim</span>
                        <i className=" bi bi-send-fill mx-2"></i>
                    </button>
                    <button type="button" className=" btn btn-outline-danger" onClick={() => handleReset()}>
                        <span>Reset</span>
                        <i className=" bi bi-arrow-repeat mx-2"></i>
                    </button>
                </div>
                <hr />
                <p className=" text-secondary">Pindah ke halaman</p>
                <div className=" d-flex gap-2">
                    <Link to={'/pengumpulan'} className=" btn btn-outline-primary rounded-5">
                        <span>Pengumpulan</span>
                        <i className="bi bi-chevron-right mx-2"></i>
                    </Link>
                    <Link to={'/peminjaman'} className=" btn btn-outline-primary rounded-5">
                        <span>Peminjaman</span>
                        <i className="bi bi-chevron-right mx-2"></i>
                    </Link>
                    <Link to={'/pengambilan'} className=" btn btn-outline-primary rounded-5">
                        <span>Pengambilan</span>
                        <i className="bi bi-chevron-right mx-2"></i>
                    </Link>
                    <Link to={'/kelas'} className=" btn btn-outline-primary rounded-5">
                        <span>Lihat Kelas</span>
                        <i className="bi bi-chevron-right mx-2"></i>
                    </Link>
                </div>
            </section>
            {isModal && (
                <section className=" pb-4
                modalCamera d-flex justify-content-center align-items-center gap-4 flex-column glassBox rounded-5">
                    <div className=" d-flex justify-content-center align-items-center gap-2 flex-column rounded-5 p-4 border shadow-lg">
                        <video ref={videoRef} playsInline autoPlay style={{ transform: "scaleX(-1)" }} className=" rounded-4 shadow">
                        </video>
                    </div>
                    <div className=" d-flex justify-content-center align-items-center gap-4">
                        <button type="button" className=" btn btn-primary" onClick={() => takePhoto()}>
                            <span>Ambil Foto</span>
                            <i className="bi bi-camera mx-2"></i>
                        </button>
                        <button type="button" className=" btn btn-danger" onClick={() => closeModal()}>
                            <span>Tutup</span>
                            <i className="bi bi-x-square-fill mx-2"></i>
                        </button>
                    </div>
                </section>
            )}
        </>
    )
}

export default FormPengumpulan