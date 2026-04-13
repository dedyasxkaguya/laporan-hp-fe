import { useEffect, useState } from "react"

const Clock = () => {
    const [currentClock,setClock] = useState<string>("")
    useEffect(() => {
        setInterval(() => {
            const date = new Date()
            const hours = date.getHours().toString().padStart(2,"0")
            const minutes = date.getMinutes().toString().padStart(2,"0")
            const seconds = date.getSeconds().toString().padStart(2,"0")
            const ms = date.getMilliseconds().toString().padStart(2,"0")
            setClock(`${hours} : ${minutes} : ${seconds} : ${ms}`)
        }, 1000/24)
    }, [])
    return (
        <span>{currentClock}</span>
    )
}

export default Clock