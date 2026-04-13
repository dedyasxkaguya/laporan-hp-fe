import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
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

const LaporanPengumpulan = () => {
    const [data, setData] = useState<Data[]>()
    useEffect(() => {
        axios.get<Data[]>('http://127.0.0.1:8000/api/report/type/pengambilan')
            .then(data => {
                const fetched = data.data
                setData(fetched)
            })
    },[])
    return (
        <>
            <Navbar />
            <main>
                <p>Laporan Pengambilan Gawai</p>
                <table className=" table table-light table-striped table-borderless">
                    <thead>
                        <tr>
                            {/* <th>No</th> */}
                            <th>Kelas</th>
                            <th>Nama Petugas</th>
                            <th>Nama Guru</th>
                            <th>Tanggal</th>
                            {/* <th>Gambar</th> */}
                            <th>Status</th>
                            <th>Foto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((a) => {
                            return (
                                <tr>
                                    {/* <td>{a.id}</td> */}
                                    <td>{a.student_class.grade} {a.student_class.name}</td>
                                    <td>{a.officer}</td>
                                    <td>{a.teacher.name}</td>
                                    <td>{a.formatted_date.toString()}</td>
                                    <td>
                                        {a.is_today ? <div className=" bg-success p-2 text-white rounded-2">Sudah</div>
                                            : <div className=" bg-danger p-2 text-white rounded-2">
                                                Belum</div>}
                                    </td>
                                    <td>
                                        <a className="btn btn-info" href={`http://127.0.0.1:8000/${a.image}`} target="_blank">
                                            Foto
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main>
        </>
    )
}

export default LaporanPengumpulan