
interface dataProps {
    len: number | undefined
}

const Datacount = ({ len }: dataProps) => {
    return (
        <div className=" d-flex gap-2 bg-light p-2 rounded-4 border fw-semibold text-secondary" style={{ cursor:"pointer" }}>
            <i className="bi bi-list-ul me-2 text-primary"></i>
            <p className="m-0">Total data : {len}</p>
        </div>
    )
}

export default Datacount