import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Modalbox from "./Modalbox";
export interface Data {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
}

const Navbar = () => {
    const [user, setUser] = useState<Data>()
    const [open, setOpen] = useState<boolean>()
    // const [load, isLoad] = useState<boolean>(true)
    useEffect(() => {
        if (localStorage.getItem("tokenAsli")) {
            const token: string = localStorage.getItem("token")!
            if (token) {
                axios.post<Data>("http://127.0.0.1:8000/api/getaccount", {}, {
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
    }, [])
    const handleOpen = () => {
        setOpen(!open)
    }
    const handleLogout = () => {
        localStorage.clear()
        location.href = '/login'
    }
    return (
        <>
            <nav className=" bg-primary-subtle p-3 py-2 text-white d-flex justify-content-between align-items-center w-100 position-absolute top-0 start-0">
                <div className="">
                    <Link to={'/'} className="btn btn-primary">
                        <span>Home</span>
                        <i className="bi bi-house-fill mx-2"></i>
                    </Link>
                </div>
                <div className=" d-flex justify-content-center align-items-center gap-2">
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Pages
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <Link to={'/pengumpulan'} className="dropdown-item">
                                    <i className="bi bi-box-arrow-in-down me-2"></i>
                                    <span>Pengumpulan</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/pengambilan'} className="dropdown-item">
                                    <i className="bi bi-box-arrow-in-up me-2"></i>
                                    <span>Pengambilan</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/peminjaman'} className="dropdown-item">
                                    <i className="bi bi-box-arrow-in-up me-2"></i>
                                    <span>Peminjaman</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/kelas'} className="dropdown-item">
                                    <i className="bi bi-collection me-2"></i>
                                    <span>Kelas</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {!user && (
                        <Link to={'/login'} className=" btn btn-light p-2 px-3">
                            <span>Login</span>
                            <i className="bi bi-box-arrow-in-right mx-2"></i>
                        </Link>
                    )}
                    {user && (
                        <button type="button" className=" p-2 px-3 rounded-5 bg-light border text-primary"
                            onClick={() => handleOpen()}>
                            <i className="bi bi-person-circle me-2"></i>
                            <span className=" fw-light text-capitalize">{user.username}</span>
                        </button>
                    )}
                </div>
            </nav>
            {open && user && (
                <Modalbox>
                    <section className=" p-2 border rounded-3 shadow bg-white">
                        <div className=" fw-light text-capitalize fs-4 rounded-2 d-flex justify-content-between align-items-center mb-2">
                            <p className=" m-0">Halo, <span className=" fw-semibold">{user.username}</span></p>
                            <button type="button" className=" btn btn-close" onClick={()=>handleOpen()}></button>
                        </div>
                        <p>Selamat datang di halaman menu singkat</p>
                        <div className="d-flex gap-2">
                            <button type="button" className=" btn btn-outline-danger" onClick={() => handleLogout()}>
                                <i className="bi bi-arrow-repeat me-2"></i>
                                <span>Logout</span>
                            </button>
                            {/* <button type="button" className=" btn btn-outline-danger">
                            <i className="bi bi-arrow-repeat me-2"></i>
                            <span>Login Ulang</span>
                            </button> */}
                        </div>
                    </section>
                </Modalbox>
            )}
        </>
    )
}

export default Navbar