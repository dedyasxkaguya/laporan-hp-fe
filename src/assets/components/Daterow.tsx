interface dateProps {
    date: string
}
const Daterow = ({ date }: dateProps) => {
    return (
        <div className="">

            <i className="bi bi-calendar3 me-2"></i>
            <span>{date}</span>
        </div>
    )
}

export default Daterow