import { useState } from "react"
import Modalbox from "./Modalbox"

interface statusProps {
    type: string
    note: string | null
    teacher: string
}
const Status = ({ type, note, teacher }: statusProps) => {
    const [modal, setModal] = useState<boolean>()
    if (type == "null") {
        return (
            <div className={`p-2 rounded-5 shadow-sm bg-danger-subtle text-danger fw-light text-center`} style={{ cursor: "pointer" }}>Tidak ada</div>
        )
    }
    const handlenote = () => {
        console.log(note)
        if (note) {
            setModal(true)
        }
    }
    const handleClose = () => {
        setModal(false)
    }
    return (
        <>
            <div className={`p-2 rounded-5 shadow-sm text-center 
            ${type.toLowerCase() == "pengumpulan"
                    ? "bg-success-subtle text-success"
                    : type.toLowerCase() == "pengambilan"
                        ? "bg-primary-subtle text-primary"
                        : "bg-warning text-black"}`}
                style={{ cursor: "pointer" }} onClick={() => handlenote()}>
                {type.toLowerCase() !== "peminjaman" ? type : "Detail"}
            </div>
            {modal && (
                <Modalbox>
                    <div className=" p-2 bg-white rounded-2">
                        <div className=" d-flex gap-4">
                            <p className=" text-secondary m-0">
                                <i className="bi bi-info-circle me-2"></i>
                                <span>Informasi peminjaman</span>
                            </p>
                            <button type="button" className=" btn btn-close" onClick={() => handleClose()}></button>
                        </div>
                        <hr />
                        <section className=" d-flex flex-column gap-2 border p-2 rounded-2">
                            <div className="">
                                <p className=" m-0 fw-light text-secondary">Catatan :</p>
                                <p className=" fw-semibold">{note}</p>
                            </div>
                            <div className="">
                                <p className=" m-0 fw-light text-secondary">Guru :</p>
                                <p className=" fw-semibold">{teacher}</p>
                            </div>
                        </section>
                    </div>
                </Modalbox>
            )}
        </>
    )
}

export default Status