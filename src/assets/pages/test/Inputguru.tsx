import axios from 'axios'
import { useEffect, useState } from 'react'
export interface DataTeacher {
    id:         number;
    class_name: string;
    name:       string;
    uuid:       string;
    classroom:  string;
    created_at: Date;
    updated_at: Date;
}

const Inputguru = () => {
    const [teachers, setTeachers] = useState<DataTeacher[]>()
    useEffect(() => {
        axios.get<DataTeacher[]>("http://127.0.0.1:8000/api/teacher")
            .then(data => {
                const fetched = data.data
                setTeachers(fetched)
            })
    })
    const handleteacherName = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }
    return (
        <div>

            <input type="text" name="" id="inputGuru" list='dataGuru' onChange={(e)=>handleteacherName(e)}/>
            <datalist id='dataGuru'>
                {teachers?.map((a)=>{
                    return(
                        <option value={a.name}>{a.name}</option>
                    )
                })}
            </datalist>

        </div>
    )
}

export default Inputguru