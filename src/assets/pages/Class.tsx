import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import Today from "../components/Today"
import Navbar from "../components/Navbar"
import Classlink from "../components/Classlink"
import Daterow from "../components/Daterow"
import Status from "../components/Status"

export interface Data {
    id: number
    teacher_id: number
    name: string
    vocation: string
    uuid: string
    grade: string
    created_at: Date
    updated_at: Date
    teacher: Teacher
    latest_report: LatestReport | null
}

export interface LatestReport {
    id: number
    student_class_id: number
    teacher_id: number
    date: Date
    type: string
    officer: string
    image: string
    created_at: Date
    updated_at: Date
    formatted_date: Date
    is_today: boolean
}

export interface Teacher {
    id: number
    class_name: string
    name: string
    uuid: string
    classroom: string
    created_at: Date
    updated_at: Date
}

const Class = () => {
    const [data, setData] = useState<Data[]>()
    const [report, setReport] = useState<number>(0)
    const [kelasFilter, setKelas] = useState<string[]>(["X", "XI", "XII"])
    const [jurusanFilter, setJurusan] = useState<string>("")
    const [statusFilter, setStatus] = useState<string>("")

    const jurusanRef = useRef<HTMLSelectElement>(null)
    const kelasRef = useRef<HTMLSelectElement>(null)
    const statusRef = useRef<HTMLSelectElement>(null)

    const total: number = 33
    useEffect(() => {
        axios.get<Data[]>("http://127.0.0.1:8000/api/class")
            .then(data => {
                const fetched = data.data
                setData(fetched)
                let isReport = 0
                fetched.map((a) => {
                    if (a.latest_report !== null) {
                        isReport += 1
                    }
                    setReport(isReport)
                })
            })
    }, [])
    const handleResetFilter = () => {
        if (jurusanRef.current && kelasRef.current && statusRef.current) {
            jurusanRef.current.value = ""
            kelasRef.current.value = ""
            statusRef.current.value = ""
            setStatus("")
            setKelas(["X", "XI", "XII"])
            setJurusan("")
        }
    }
    const handleKelas = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKelas([e.target.value])
    }
    const handleJurusan = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setJurusan(e.target.value)
    }
    const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
    }
    return (
        <>
            <Navbar />
            <main>
                {/* <p>Class</p> */}
                <section className=" p-2 rounded-4 my-4 shadow-sm border">
                    <div className="p-2 d-flex justify-content-between align-items-center">
                        <div className=" p-2 rounded-2 bg-primary-subtle text-primary" style={{ width: "fit-content" }}>
                            <span>Daftar Kelas SMKN 1 Jakarta</span>
                        </div>
                        <Today />
                    </div>
                    <div className="p-2">
                        <hr />
                        <div className="p-2">
                            <p>Laporan terbaru</p>
                            <div className="d-flex gap-4">
                                <div className=" p-2 bg-light rounded-2">
                                    Total laporan : <span>{report}</span>
                                </div>
                                <div className=" p-2 bg-warning rounded-2">
                                    Belum ada laporan : <span>{total - report}</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex gap-4 align-items-start p-2">
                            <i className="bi bi-sliders fs-5"></i>
                            <div className="">
                                <label htmlFor="filterJurusan" className=" form-label">Jurusan</label>
                                <select name="filterJurusan" id="filterJurusan" className=" form-select" onChange={(e) => handleJurusan(e)}
                                    ref={jurusanRef}>
                                    <option value="" selected hidden>Pilih Jurusan</option>
                                    <option value="Bangunan">Bangunan</option>
                                    <option value="Listrik">Listrik</option>
                                    <option value="Mesin">Mesin</option>
                                    <option value="Otomotif">Otomotif</option>
                                    <option value="Informatika">Informatika</option>
                                </select>
                            </div>
                            <div className="">
                                <label htmlFor="filterKelas" className=" form-label">Kelas</label>
                                <select name="filterKelas" id="filterKelas" className=" form-select" ref={kelasRef} onChange={(e) => handleKelas(e)}>
                                    <option value="" selected hidden>Pilih Kelas</option>
                                    <option value="X">X (Satu)</option>
                                    <option value="XI">XI (Dua)</option>
                                    <option value="XII">XII (Tiga)</option>
                                </select>
                            </div>
                            <div className="">
                                <label htmlFor="filterStatus" className=" form-label">Status</label>
                                <select name="filterStatus" id="filterStatus" className=" form-select" ref={statusRef} onChange={(e) => handleStatus(e)}>
                                    <option value="" selected hidden>Pilih Status</option>
                                    <option value="Pengumpulan">Pengumpulan</option>
                                    <option value="Pengambilan">Pengambilan</option>
                                </select>
                            </div>
                            <div className="">
                                <p className=" m-0 mb-2 ">Reset</p>
                                <button type="button" className="btn btn-danger" onClick={() => handleResetFilter()}>
                                    <span>Reset</span>
                                    <i className="bi bi-arrow-repeat mx-2"></i>
                                </button>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className="p-4 py-2">
                        <p>Tabel Laporan Kelas</p>
                        <table className=" table table-borderless">
                            <thead>
                                <tr className=" table-primary table-borderless">
                                    {/* <th className=" text-center fw-light text-secondary align-middle" rowSpan={2}>ID</th> */}
                                    <th className=" text-center fw-light align-middle" rowSpan={2}>Kelas</th>
                                    <th className=" text-center fw-light align-middle" rowSpan={2}>Jurusan</th>
                                    <th className=" text-center fw-light align-middle" rowSpan={2}>Wali Kelas</th>
                                    {/* <th className=" text-center fw-light align-middle" colSpan={3}>Laporan Terakhir</th> */}
                                    <th className=" text-center fw-light">Status</th>
                                    <th className=" text-center fw-light">Petugas</th>
                                    <th className=" text-center fw-light">Tanggal</th>
                                </tr>
                                {/* <tr className=" table-primary table-borderless">
                        </tr> */}
                            </thead>
                            <tbody>
                                {data?.map((a) => {
                                    const type = a.latest_report?.type ?? "Tidak ada"
                                    console.log(kelasFilter, jurusanFilter, statusFilter)
                                    if (kelasFilter.includes(a.grade)
                                        && a.vocation.toLowerCase().includes(jurusanFilter.toLowerCase())
                                        && type.toLowerCase().includes(statusFilter.toLowerCase())) {
                                        return (
                                            <tr>
                                                {/* <td className=" text-secondary">{a.id}</td> */}
                                                <td className=" p-2 px-4 align-middle "><Classlink grade={a.grade} name={a.name} /></td>
                                                <td className=" p-2 px-4 align-middle ">{a.vocation}</td>
                                                <td className=" p-2 px-4 align-middle fw-semibold">{a.teacher.name}</td>
                                                <td className=" p-2 px-4 align-middle ">
                                                    {
                                                        a.latest_report ?
                                                            <Status type={a.latest_report.type} /> : <Status type={"null"} />
                                                    }
                                                </td>
                                                <td className=" p-2 px-4 align-middle text-capitalize fw-semibold">
                                                    {a.latest_report
                                                        ? <span className="">{a.latest_report.officer.toLowerCase()}</span>
                                                        : <span className="">-</span>}
                                                </td>
                                                <td className=" p-2 px-4 align-middle">
                                                    {a.latest_report
                                                        ? <Daterow date={a.latest_report.date.toString()} />
                                                        : <span className="">-</span>}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    // }
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Class