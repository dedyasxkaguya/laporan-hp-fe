import { useRef } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
export interface Data {
    status: boolean
    data: DataClass
    token: string
}

export interface DataClass {
    id: number
    username: string
    created_at: Date
    updated_at: Date
}

const Login = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {
        Swal.fire({
            title: "Wait a second...",
            text: "Fetching our API",
            showConfirmButton: false,
            toast: true
        })
        const usernameValue = usernameRef.current?.value
        const passwordValue = passwordRef.current?.value
        if (usernameValue && passwordValue) {
            const formdata = new FormData()
            formdata.append("username", usernameValue)
            formdata.append("password", passwordValue)
            axios.post<Data>("http://127.0.0.1:8000/api/login", formdata)
                .then(data => {
                    const fetched = data.data
                    if (fetched.status) {
                        Swal.fire({
                            icon: "success",
                            title: "Sukses",
                            text: "Berhasil login sebagai " + fetched.data.username,
                            showConfirmButton: false,
                            toast: true,
                            timer: 2000,
                            timerProgressBar: true
                        })
                        localStorage.setItem("token",fetched.token.toString())
                        setTimeout(() => {
                            location.href = '/'
                        }, 2000)
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: "Tidak menemukan akun, periksa username dan password",
                            showConfirmButton: false,
                            toast: true,
                            timer: 2000,
                            timerProgressBar: true
                        })
                    }
                })
        }
    }
    return (
        <main className=" col-lg-4 col-10 p-4 rounded-4 border shadow">
            <section>
                {/* <div className=" p-2 bg-primary-subtle text-primary rounded-2 " style={{ width:"fit-content" }}>
                    <p className=" m-0">Login untuk mengakses fitur</p>
                </div> */}
                <p className=" fw-semibold fs-2 m-0">Halo</p>
                <p className=" fw-light">Login untuk mengakses fitur</p>
            </section>
            <section className=" d-flex flex-column gap-2">
                <div className=" form-floating">
                    <input type="text" name="username" id="username" placeholder="Masukkan Username" ref={usernameRef}
                        className=" form-control" />
                    <label htmlFor="username" className=" form-label">
                        Masukkan Username
                    </label>
                </div>
                <div className=" form-floating">
                    <input type="password" name="password" id="password" placeholder="Masukkan Password" ref={passwordRef}
                        className=" form-control" />
                    <label htmlFor="password" className=" form-label">
                        Masukkan Password
                    </label>
                </div>
                <div className=" d-flex gap-2">
                    <button type="submit" className=" btn btn-primary " onClick={() => handleSubmit()}
                        style={{ width: "fit-content" }}>
                        Kirim
                    </button>
                    <Link className=" btn btn-light " to={'/'}
                        style={{ width: "fit-content" }}>
                        Kembali
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Login