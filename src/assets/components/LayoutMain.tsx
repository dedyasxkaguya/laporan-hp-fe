import type { ReactNode } from "react"

const LayoutMain = ({children}:{children:ReactNode}) => {
  return (
    <main className=" col-8 col-lg-6 p-4 shadow rounded-5 mt-4">
        {children}
    </main>
  )
}

export default LayoutMain