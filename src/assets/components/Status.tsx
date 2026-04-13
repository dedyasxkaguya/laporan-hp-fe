interface statusProps {
    type: string
}
const Status = ({ type }: statusProps) => {
    if (type == "null") {
        return (
            <div className={`p-2 rounded-5 shadow-sm bg-danger-subtle text-danger fw-light text-center`} style={{ cursor: "pointer" }}>Tidak ada</div>    
        )
    }
    return (
        <div className={`p-2 rounded-5 shadow-sm text-center ${type.toLowerCase() == "pengumpulan"
                    ? "bg-success-subtle text-success"
                    : "bg-primary-subtle text-primary"}`} style={{ cursor: "pointer" }}>
            {type}
        </div>
    )
}

export default Status