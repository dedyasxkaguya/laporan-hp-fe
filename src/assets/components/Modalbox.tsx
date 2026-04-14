import type React from "react"

const Modalbox = ({children}:{children: React.ReactNode}) => {
  return (
     <section className=" p-2 border rounded-4 shadow modalCamera glassBox">
        {children}
     </section>
  )
}

export default Modalbox