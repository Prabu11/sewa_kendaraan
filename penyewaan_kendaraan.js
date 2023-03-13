const express = require("express")
const router = express.Router()
const db = require("./db")
const moment = require("moment")

router.post("/penyewaan_kendaraan", (req,res) => {
    let data = {
        id_penyewa: req.body.id_penyewa,
        id_admin: req.body.id_admin,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    let data_kendaraan = JSON.parse(req.body.data_kendaraan)
    let sql = " insert into penyewaan_kendaraan set ?"

    db.query(sql, data, (error, result) => {
        let response = null

        if (error) {
            res.json({message: error.message})
        } else {
            let lastID = result.insertId

            let data = []
            for (let index = 0; index < data_kendaraan.length; index++) {
                data.push([
                    lastID, data_kendaraan[index].id_kendaraan
                ])
            }

            let sql = "insert into detail_penyewaan_kendaraan values ?"

            db.query(sql, [data], (error, result ) => {
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

router.get("/penyewaan_kendaraan", (req,res) => {
    let sql = " select penyewaan_kendaraan.id_penyewaan_kendaraan, penyewaan_kendaraan.id_penyewa, penyewaan_kendaraan.waktu, data_kendaraan.nopol, data_penyewa.nama, penyewaan_kendaraan.id_admin, data_admin.nama_admin from detail_penyewaaan_kendaraan detail_penyewaan_kendaraan join penyewaan_kendaraan penyewaan_kendaraan on detail_penyewaan_kendaraan.id_penyewaan_kendaraan = penyewaan_kendaraan.id_penyewaan_kendaraan join data_kendaraan data_kendaraan on detail_penyewaan_kendaraan.id_kendaraan = data_kendaraan.id_kendaraan join data_penyewa on penyewaan_kendaraan.id_penyewa = data_penyewa.id_penyewa join data_admin data_admin on penyewaan_kendaraan.id_admin = data_admin.id_admin"

    db.query(sql, (error, result) => {
        if (error) {
            res.json({message: error.message})
        } else {
            res.json({
                count: result.length,
                penyewaan_kendaraan: result
            })
        }
    })
})

router.get("/penyewaan_kendaraan/:id_penyewaan_kendaraan", (req,res) => {
    let param = { id_penyewaan_kendaraan: req.params.id_penyewaan_kendaraan }

    let sql = "select data_kendaraan.warna, data_kendaraan.kondisi_kendaraan from detail_penyewaan_kendaraan detail_penyewaan_kendaraan join data_kendaraan data_kendaraan on data_kendaraan.id_kendaraan = detail_penyewaan_kendaraan.id_kendaraan where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({message: error.message})
        } else {
            res.json({
                count: result.length,
                detail_penyewaan_kendaraan: result
            })
        }
    })
})

router.delete("/penyewaan_kendaraan/:id_penyewaan_kendaraan", (req, res) => {
    let param = { id_penyewaan_kendaraan: req.params.id_penyewaan_kendaraan }

    let sql = "delete from detail_penyewaan_kendaraan where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            let param = { id_penyewaan_kendaraan: req.params.id_penyewaan_kendaraan }
        }

        let sql = "delete from penyewaan_kendaraan where ?"

        db.query(sql, param, (error, result) => {
            if (error) {
                res.json({ message: error.message})
            } else {
                res.json({message: "Data has been deleted"})
            }
        })
    })
})

module.exports = router