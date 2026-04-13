import axios from 'axios';
import { useEffect, useState } from 'react'
import Laporan from './test/Laporan';
export interface Data {
    id: number;
    student_class_id: number;
    date: Date;
    type: string;
    officer: string;
    image: string;
    teacher: string;
    created_at: Date;
    updated_at: Date;
    formatted_date: Date;
    is_today: boolean;
    student_class: StudentClass;
}

export interface StudentClass {
    id: number;
    name: string;
    vocation: string;
    grade: string;
    created_at: Date;
    updated_at: Date;
}
const Test = () => {
    const [data, setData] = useState<Data[]>()
    useEffect(() => {
        axios.get<Data[]>('http://127.0.0.1:8000/api/report')
            .then(data => {
                const fetched = data.data
                setData(fetched)
            })
    })
    return (
        <>
            <div>
                <p>Test</p>
                <table className=" table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Petugas</th>
                            <th>Kelas</th>
                            <th>Nama Guru</th>
                            <th>Tipe Laporan</th>
                            <th>Gambar</th>
                            <th>Waktu Pengumpulan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((a) => {
                            return (
                                <tr>
                                    <td>{a.id}</td>
                                    <td>{a.officer}</td>
                                    <td>{a.student_class?.grade} {a.student_class?.name}</td>
                                    <td>{a.teacher}</td>
                                    <td>{a.type}</td>
                                    <td>{a.is_today ? "Hari ini" : "Kemarin"}</td>
                                    <td>{a.date.toString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <Laporan type='Pengumpulan' />
        </>
    )
}

export default Test