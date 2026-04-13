import { Link } from 'react-router-dom'
interface btnProps {
    src: string
}
const PhotoBtn = ({ src }: btnProps) => {
    return (
        <Link className="btn btn-primary rounded-5 shadow fw-semibold" to={`http://127.0.0.1:8000/${src}`} target="_blank">
            <i className="bi bi-camera me-2"></i>
            <span>Lihat Foto</span>
        </Link>
    )
}

export default PhotoBtn