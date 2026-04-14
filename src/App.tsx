// import React from 'react'

import { Route, Routes } from "react-router-dom"
import Home from "./assets/pages/Home"
// import Test from "./assets/pages/Test"
// import LaporanPengambilan from "./assets/pages/LaporanPengambilan"
import Class from "./assets/pages/Class"
import SingleClass from "./assets/pages/SingleClass"
import Laporan from "./assets/pages/Laporan"
// import Laporan from "./assets/pages/test/Laporan"
import FormPengumpulan from "./assets/components/test/FormPengumpulan"
import Login from "./assets/pages/Login"

const App = () => {
  return (
    <main className=" d-flex justify-content-center align-items-center pt-4">
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/pengumpulan" element={<Laporan type="pengumpulan" />} />
        <Route path="/pengambilan" element={<Laporan type="pengambilan" />} />
        <Route path="/peminjaman" element={<Laporan type="peminjaman" />} />
        <Route path="/kelas" element={<Class />} />
        <Route path="/kelas/:uuid" element={<SingleClass />} />

        <Route path="/login" element={<Login />} />

        <Route path="/test" element={<FormPengumpulan />} />
      </Routes>
    </main>
  )
}

export default App