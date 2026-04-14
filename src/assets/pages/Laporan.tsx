import axios from "axios"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Classlink from "../components/Classlink"
import Datacount from "../components/Datacount"
import PhotoBtn from "../components/PhotoBtn"
import Daterow from "../components/Daterow"
import Status from "../components/Status"
// import Modalbox from "../components/Modalbox"
export interface Data {
    id: number
    student_class_id: number
    teacher_id: number
    date: Date
    type: string
    officer: string
    image: string
    notes: string
    created_at: Date
    updated_at: Date
    formatted_date: Date
    is_today: boolean
    student_class: StudentClass
    teacher: Teacher
    phone: number
}

export interface StudentClass {
    id: number
    name: string
    vocation: string
    grade: string
    created_at: Date
    updated_at: Date
}

export interface Teacher {
    id: number
    name: string
    email: string
    created_at: Date
    updated_at: Date
}
interface ReportProps {
    type: string
}
export interface DataUser {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
}
const Laporan = ({ type }: ReportProps) => {
    const [data, setData] = useState<Data[]>()
    const [isLoad, setLoad] = useState<boolean>(true)
    const [query, setQuery] = useState<string>("")
    const [isEmpty, setEmpty] = useState<boolean>(true)
    const [user, setUser] = useState<DataUser>()
    // const [dateNow, setDate] = useState<string>()
    const token: string = localStorage.getItem("token")!
    const apiLink = `http://127.0.0.1:8000/api/report/type/${type}`
    useEffect(() => {
        axios.get<Data[]>(apiLink)
            .then(data => {
                const fetched = data.data
                setTimeout(() => {
                    setLoad(false)
                    setData(fetched)
                    if (fetched.length < 1) {
                        setEmpty(true)
                    } else {
                        setEmpty(false)
                    }
                }, 1000)
            })
        if (localStorage.getItem("token")) {
            if (token) {
                axios.post<DataUser>("http://127.0.0.1:8000/api/getaccount", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(data => {
                        const fetched = data.data
                        setUser(fetched)
                    })
            }
        }
    }, [apiLink, token])
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const handleDelete = (id: number) => {
        axios.delete(`http://127.0.0.1:8000/api/report/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(data => {
                const fetched = data.data
                console.log(fetched)
            })
    }
    return (
        <>
            <Navbar />
            <main className=" p-4 rounded-5 bg-white shadow-lg">
                <section className=" d-flex gap-2 mb-2 align-items-center">
                    <div className=" p-1 bg-primary-subtle text-primary rounded-3">
                        <i className="bi bi-file-earmark-bar-graph-fill fs-2"></i>
                    </div>
                    <p className=" m-0 fs-4 fw-semibold text-capitalize">Laporan {type} Gawai</p>
                </section>
                <div className=" px-2 d-flex justify-content-between align-items-center mb-2 gap-4">
                    <p className=" text-secondary m-0">Data seluruh aktivitas {type} gawai SMKN 1 Jakarta</p>
                    <Datacount len={data?.length} />
                </div>
                <section className=" p-2">
                    <input type="text" placeholder="Cari data" className=" form-control" onChange={(e) => handleQuery(e)} />
                    <br />
                    {isLoad && (
                        <p>Wait a minute...</p>
                    )}
                    <table className=" table table-borderless">
                        <thead>
                            <tr className=" table-primary border-bottom">
                                {/* <th>No</th> */}
                                <td className=" text-center">Kelas</td>
                                <td className=" text-center">Nama Petugas</td>
                                <td className=" text-center">Nama Guru</td>
                                <td className=" text-center">Jumlah Handphone</td>
                                <td className=" text-center">Tanggal</td>
                                {type == "peminjaman" && (
                                    <td className=" text-center">Detail</td>
                                )}
                                <td className=" text-center">Foto</td>
                                {user && (
                                    <td className=" text-center">Delete</td>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((a) => {
                                if (a.student_class.name.toLowerCase().includes(query.toLowerCase())
                                    || a.officer.toLowerCase().includes(query.toLowerCase())
                                    || a.teacher.name.toLowerCase().includes(query.toLowerCase())) {
                                    return (
                                        <tr>
                                            <td className=" p-2 px-4 align-middle fw-semibold">
                                                <Classlink grade={a.student_class.grade} name={a.student_class.name} />
                                            </td>
                                            <td className=" p-2 px-4 align-middle text-capitalize fw-semibold">
                                                {a.officer.toLowerCase()}
                                            </td>
                                            <td className=" p-2 px-4 align-middle">{a.teacher.name}</td>
                                            <td className=" p-2 px-4 align-middle">{a.phone.toString().padStart(2, '0')}
                                                <span className=" text-secondary"> / 36 ({((a.phone / 36) * 100).toPrecision(3)}%)</span>
                                            </td>
                                            <td className=" text-secondary p-2 px-4 align-middle">
                                                <Daterow date={a.date.toString()} />
                                            </td>
                                            {type == "peminjaman" && (
                                                <td className=" p-2 px-4 align-middle">
                                                    <Status type={a.type} note={a.notes} teacher={a.teacher.name} />
                                                </td>
                                            )}
                                            <td className=" p-2 px-4 align-middle">
                                                <PhotoBtn data={a} />
                                            </td>
                                            {user && (
                                                <td className=" p-2 px-4 align-middle">
                                                    <button type="button" className=" btn btn-danger" onClick={() => handleDelete(a.id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </section>
                {isEmpty && (
                    <p className=" m-0 mx-2">Tidak ada laporan</p>
                )}
            </main>
            {/* {data && (
                <Modalbox>
                    <div className=" bg-white p-2">
                        <section className=" d-flex justify-content-between align-items-center ">
                            <div className=" p-2 bg-secondary-subtle text-black rounded-2 shadow-sm"
                                style={{ width: "fit-content" }}>
                                <p className=" m-0"><i className="bi bi-info-circle me-2"></i> Foto Petugas</p>
                            </div>
                            <button type="button" className=" btn btn-close"></button>
                        </section>
                        <hr />
                        <img src={`http://127.0.0.1:8000/${data[0].image}`} alt="" className=" rounded-2 shadow" />
                        <section className=" d-flex gap-2">
                            <div className=" d-flex gap-2 p-2 bg-primary-subtle text-primary rounded-4 my-2"
                                style={{ width: "fit-content" }}>
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <p className=" fw-light m-0">
                                    Laporan
                                    <span className=" fw-semibold mx-2">
                                        {data[0].officer}</span>
                                </p>
                            </div>
                            <div className=" d-flex gap-2 p-2 bg-warning text-black rounded-4 my-2"
                                style={{ width: "fit-content" }}>
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <p className=" fw-light m-0">
                                    Tipe
                                    <span className=" fw-semibold mx-2">
                                        {data[0].type}</span>
                                </p>
                            </div>
                        </section>
                        <p className=" text-secondary m-0">Tanggal {data[0].date.toString()}</p>
                    </div>
                </Modalbox>
            )} */}
        </>
    )
}

export default Laporan 