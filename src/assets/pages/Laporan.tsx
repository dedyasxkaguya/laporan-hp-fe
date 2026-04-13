import axios from "axios"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Classlink from "../components/Classlink"
import Datacount from "../components/Datacount"
import PhotoBtn from "../components/PhotoBtn"
import Daterow from "../components/Daterow"
export interface Data {
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
const Laporan = ({ type }: ReportProps) => {
    const [data, setData] = useState<Data[]>()
    const [isLoad, setLoad] = useState<boolean>(true)
    const [query, setQuery] = useState<string>("")
    const [isEmpty,setEmpty] = useState<boolean>(true)
    // const [dateNow, setDate] = useState<string>()
    const apiLink = `http://127.0.0.1:8000/api/report/type/${type}`
    useEffect(() => {
        axios.get<Data[]>(apiLink)
            .then(data => {
                const fetched = data.data
                setTimeout(() => {
                    setLoad(false)
                    setData(fetched)
                    if(fetched.length < 1){
                        setEmpty(true)
                    }else{
                        setEmpty(false)
                    }
                }, 1000)
                // const dateArr: string[] = new Date().toLocaleDateString('id-ID', {
                //     year: "numeric",
                //     month: "2-digit",
                //     day: "2-digit"
                // }).split("/")
                // const dateTemplate: string = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
                // setDate(dateTemplate)
            })
    }, [apiLink])
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
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
                    <table className=" table table-borderless">
                        <thead>
                            <tr className=" table-primary border-bottom">
                                {/* <th>No</th> */}
                                <td className=" text-center">Kelas</td>
                                <td className=" text-center">Nama Petugas</td>
                                <td className=" text-center">Nama Guru</td>
                                <td className=" text-center">Jumlah Handphone</td>
                                <td className=" text-center">Tanggal</td>
                                <td className=" text-center">Foto</td>
                            </tr>
                        </thead>
                        {isLoad && (
                            <p>Wait a minute...</p>
                        )}
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
                                            <td className=" p-2 px-4 align-middle">
                                                <PhotoBtn src={a.image} />
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    {isEmpty && (
                        <p>Tidak ada laporan</p>
                    )}
                </section>
            </main>
        </>
    )
}

export default Laporan 