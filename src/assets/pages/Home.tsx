// import React from 'react'

import FormPengumpulan from "../components/FormPengumpulan"
import LayoutMain from "../components/LayoutMain"

const Home = () => {
    return (
        <LayoutMain>
            <section>
                <p className=" m-0 fs-1 fw-semibold">Halo, <span className=" text-primary">Selamat Datang</span></p>
                {/* <p className=" m-0 fs-3">Selamat datang di halaman pengumpulan gawai</p> */}
                <div className=" m-0 p-2 px-4 bg-primary-subtle text-primary rounded-5 fw-semibold" style={{ width: "fit-content" }}>
                    #BijakBergawai
                </div>
            </section>
            <hr />
            <FormPengumpulan />
        </LayoutMain>
    )
}

export default Home