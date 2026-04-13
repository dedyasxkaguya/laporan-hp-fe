import { useEffect, useState } from "react"

const Today = () => {
    const [currentClock, setClock] = useState<string>("")
    const dateDetail: object = { year: "numeric", month: "long", day: "numeric" }
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
    const d = new Date()
    const updateClock = () => {
        const date = new Date()
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        const seconds = date.getSeconds().toString().padStart(2, "0")
        setClock(`${hours}:${minutes}:${seconds}`)
    }
    useEffect(() => {
        // updateClock()
        setInterval(() => {
            updateClock()
        }, 1000)
    }, [])
    return (
        <div className=" mb-2">
            {/* <label htmlFor="hari" className=" form-label">Hari</label> */}
            <input type="text" name="hari" id="hari" className=" form-control" disabled value={
                `${days[d.getDay()]}, ${d.toLocaleDateString("id-ID", dateDetail)}, ${currentClock}`
            } />
        </div>
    )
}

export default Today