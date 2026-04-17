import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Datacount from "../components/Datacount"
import PhotoBtn from "../components/PhotoBtn"
import Daterow from "../components/Daterow"
import Status from "../components/Status"
import { Chart } from "chart.js/auto"

export interface Data {
    id: number;
    teacher_id: number;
    name: string;
    full_name: string;
    vocation: string;
    uuid: string;
    grade: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
    weekly_reports: Report[];
    reports: Report[];
    teacher: Teacher;
}

export interface Report {
    id: number;
    student_class_id: number;
    date: Date;
    phone: number;
    type: string;
    officer: string;
    teacher: string;
    image: string;
    notes: null | string;
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

const SingleClass = () => {
    const { uuid } = useParams()
    const [data, setData] = useState<Data>()
    // const [dateNow, setDate] = useState<string>()
    const [totalPengumpulan, setPengumpulan] = useState<number>(0)
    const [totalPengambilan, setPengambilan] = useState<number>(0)
    const [totalPeminjaman, setPeminjaman] = useState<number>(0)
    const [dataHp, setDataHp] = useState<number[]>([])
    const [dataTanggal, setDataTanggal] = useState<string[]>([])
    const [dataWarna, setDataWarna] = useState<string[]>([])
    // const days: string[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
    const ctx = document.getElementById("canvas0") as HTMLCanvasElement

    const handleChart = () => {
        if (ctx) {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: dataTanggal,
                    datasets: [
                        {
                            label: "Jumlah HP ",
                            data: dataHp,
                            borderWidth: 1,
                            backgroundColor: dataWarna
                        }
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        }
    }
    useEffect(() => {
        if (uuid) {
            axios.get<Data>(`http://127.0.0.1:8000/api/class/searchByUUID/${uuid}`)
                .then(data => {
                    const fetched = data.data
                    if (fetched.status) {
                        setData(fetched)
                        const arrHp: number[] = []
                        const arrDate: string[] = []
                        const arrBGcolor: string[] = []
                        fetched.weekly_reports.map((a) => {
                            arrHp.push(a.phone)
                            arrDate.push(new Date(a.date).toLocaleDateString('id-ID', {
                                dateStyle: 'long',
                            }))
                            arrBGcolor.push(a.type.toLowerCase() == "pengumpulan" ? "#d1e7dd" : a.type.toLowerCase() == "pengambilan" ? "#cfe2ff" : "#fff3cd")
                        })
                        setDataHp(arrHp.reverse())
                        setDataTanggal(arrDate.reverse())
                        setDataWarna(arrBGcolor.reverse())
                        const totalObj = { pengumpulan: 0, pengambilan: 0, peminjaman: 0 }
                        fetched.reports.map((a) => {
                            if (a.type.toLowerCase() == "pengumpulan") {
                                totalObj.pengumpulan += 1
                            } else if (a.type.toLowerCase() == "pengambilan") {
                                totalObj.pengambilan += 1
                            } else if (a.type.toLowerCase() == "peminjaman") {
                                totalObj.peminjaman += 1
                            }
                            setPengumpulan(totalObj.pengumpulan)
                            setPengambilan(totalObj.pengambilan)
                            setPeminjaman(totalObj.peminjaman)
                        })
                    } else {
                        console.log("Kosong")
                    }
                })
        }
        handleChart()
    }, [uuid, ctx])
    return (
        <>
            <Navbar />
            <main className=" p-3 rounded-4 border">
                <div className=" bg-primary-subtle text-primary fw-light p-2 rounded-2" style={{ width: "fit-content", cursor: "pointer" }}>
                    Informasi Kelas {uuid}
                </div>
                <hr />
                <section className="p-4">
                    <div className=" d-flex gap-2 clearfix mb-4">
                        <div className="">
                            <label htmlFor="" className=" form-label">Kelas</label>
                            <input type="text" value={data?.full_name} disabled className=" form-control" />
                        </div>
                        <div className="">
                            <label htmlFor="" className=" form-label">Bidang</label>
                            <input type="text" value={data?.vocation} disabled className=" form-control" />
                        </div>
                        <div className="">
                            <label htmlFor="" className=" form-label">Wali Kelas</label>
                            <input type="text" value={data?.teacher.name} disabled className=" form-control" />
                        </div>
                    </div>
                    <hr />
                    <div className=" d-flex justify-content-between align-items-center">
                        <p className="m-0 fw-semibold">Daftar laporan kelas {data?.full_name}</p>
                        <Datacount len={data?.reports.length} />
                    </div>
                    <div className=" d-flex gap-2 py-2 mb-4">
                        <div className="p-2 rounded-5 shadow-sm text-center bg-primary-subtle text-primary fw-light">
                            Total Pengumpulan {totalPengumpulan}
                        </div>
                        <div className="p-2 rounded-5 shadow-sm text-center bg-success-subtle text-success fw-light">
                            Total Pengambilan {totalPengambilan}
                        </div>
                        <div className="p-2 rounded-5 shadow-sm text-center bg-warning text-black fw-light">
                            Total Peminjaman {totalPeminjaman}
                        </div>
                    </div>
                    <table className=" table table-borderless">
                        <thead>
                            <tr className=" table-primary">
                                <th className=" text-center text-primary-emphasis fw-light">Nama Petugas</th>
                                <th className=" text-center text-primary-emphasis fw-light">Nama Guru</th>
                                <th className=" text-center text-primary-emphasis fw-light">Tanggal</th>
                                <th className=" text-center text-primary-emphasis fw-light">Jumlah Handphone</th>
                                <th className=" text-center text-primary-emphasis fw-light">Status</th>
                                <th className=" text-center text-primary-emphasis fw-light">Foto</th>
                            </tr>
                        </thead>
                        <tbody>{data?.reports.map((a) => {
                            return (
                                <tr>
                                    <td className=" p-2 px-4 align-middle fw-semibold text-capitalize">{a.officer.toLowerCase()}</td>
                                    <td className=" p-2 px-4 align-middle fw-semibold">{data.teacher.name}</td>
                                    <td className=" p-2 px-4 align-middle text-secondary">
                                        <Daterow date={a.date.toString()} />
                                    </td>
                                    <td className=" p-2 px-4 align-middle">{a.phone.toString().padStart(2, '0')}
                                        <span className=" text-secondary"> / 36 ({((a.phone / 36) * 100).toPrecision(3)}%)</span>
                                    </td>
                                    <td className=" p-2 px-4 align-middle">
                                        <Status type={a.type} note={a.notes} teacher={a.teacher} />
                                    </td>
                                    <td className=" p-2 px-4 align-middle">
                                        <PhotoBtn data={a} />
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </section>
                <section className=" p-4">
                    <p>Diagram Kelas {data?.full_name}</p>
                    <div className=" p-2 rounded-4 shadow-sm" style={{ width:"fit-content" }}>
                        <p className=" fw-semibold m-0">Legenda</p>
                        <hr />
                        <p className=" m-0">Pengumpulan <i className="bi bi-info-circle text-success mx-2"></i></p>
                        <p className=" m-0">Pengambilan <i className="bi bi-info-circle text-primary mx-2"></i></p>
                        <p className=" m-0">Peminjaman <i className="bi bi-info-circle text-warning mx-2"></i></p>
                    </div>
                    <canvas id="canvas0"></canvas>
                </section>
            </main >
        </>
    )
}

export default SingleClass