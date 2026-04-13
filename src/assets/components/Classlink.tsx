import { Link } from "react-router-dom"

interface LinkProps{
    grade:string
    name:string
}
const Classlink = ({grade,name}:LinkProps) => {
  return (
    <Link to={`/kelas/${grade}-${name.replaceAll(" ","-")}`} className=" text-decoration-none text-black">{grade} {name}</Link>
  )
}

export default Classlink