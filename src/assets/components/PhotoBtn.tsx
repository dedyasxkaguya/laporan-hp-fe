import { useState } from "react"
import Modalbox from "./Modalbox"

interface btnProps {
    data: DataProps
}
interface DataProps {
    image: string
    officer: string
    type: string
    date: Date
}
const PhotoBtn = ({ data }: btnProps) => {
    const [modal, setModal] = useState<boolean>(false)

    const handleModal = () => {
        setModal(!modal)
    }

    return (
        <>
            <button className="btn btn-primary rounded-5 shadow fw-semibold" type='button' onClick={() => handleModal()}>
                <i className="bi bi-camera me-2"></i>
                <span>Lihat Foto</span>
            </button>
            {modal && (

                <Modalbox>
                    <div className=" bg-white p-2">
                        <section className=" d-flex justify-content-between align-items-center ">
                            <div className=" p-2 bg-secondary-subtle text-black rounded-2 shadow-sm"
                                style={{ width: "fit-content" }}>
                                <p className=" m-0"><i className="bi bi-info-circle me-2"></i> Foto Petugas</p>
                            </div>
                            <button type="button" className=" btn btn-close" onClick={()=>handleModal()}></button>
                        </section>
                        <hr />
                        <img src={`http://127.0.0.1:8000/${data.image}`} alt="" className=" rounded-2 shadow" />
                        <section className=" d-flex gap-2">
                            <div className=" d-flex gap-2 p-2 bg-primary-subtle text-primary rounded-4 my-2"
                                style={{ width: "fit-content" }}>
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <p className=" fw-light m-0">
                                    Laporan
                                    <span className=" fw-semibold mx-2">
                                        {data.officer}</span>
                                </p>
                            </div>
                            <div className=" d-flex gap-2 p-2 bg-warning text-black rounded-4 my-2"
                                style={{ width: "fit-content" }}>
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <p className=" fw-light m-0">
                                    Tipe
                                    <span className=" fw-semibold mx-2">
                                        {data.type}</span>
                                </p>
                            </div>
                        </section>
                        <p className=" text-secondary m-0">Tanggal {data.date.toString()}</p>
                    </div>
                </Modalbox>
            )}
        </>
    )
}

export default PhotoBtn