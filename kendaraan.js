const express = require("express")
const router = express.Router()
const db = require("./db")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

router.get("/kendaraan", (req, res) => {
    
    let sql = "select * from data_kendaraan"

    
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                 message: error.message 
            }            
        } else {
            response = {
                count: result.length, 
                data_kendaraan: result 
            }            
        }
        res.json(response) 
    })
})



router.get("/kendaraan/:id", (req, res) => {
    let data = {
        id_kendaraan: req.params.id
    }
   
    let sql = "select * from data_kendaraan where ?"

   
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message 
            }            
        } else {
            response = {
                count: result.length, 
                data_kendaraan: result 
            }            
        }
        res.json(response) 
    })
})



router.post("/kendaraan", upload.single("image") ,(req,res) => {  
    let data = {
        nopol: req.body.nopol,
        warna: req.body.warna,
        kondisi_kendaraan: req.body.kondisi_kendaraan,
        image: req.file.filename
    }

    if (!req.file) {
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    }  else {
        let sql = "insert into data_kendaraan set ?"

        db.query(sql,data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})



router.put("/kendaraan", upload.single("image") ,(req,res) => {
    let data = null, sql = null
    let param = { id_kendaraan: req.body.id_kendaraan }

    if (!req.file) {
        data = {
            nopol: req.body.nopol,
            warna: req.body.warna,
            kondisi_kendaraan: req.body.kondisi_kendaraan,
            image: req.file.filename
        }

        sql = "select * from data_kendaraan where ?"
        db.query(sql, param, (err, result) => {
            if (err) throw err
            let filename = result[0].image

            let dir = path.join(__dirname, "image", filename)
            fs.unlink(dir, (error) => {})
        })
    }

    sql = "update data_kendaraan set ? where ?"

    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})



router.delete("/kendaraan/:id", (req,res) => {
    
    let data = {
        id_kendaraan: req.params.id
    }

    
    let sql = "delete from data_kendaraan where ?"

   
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) 
    })
})

module.exports = router