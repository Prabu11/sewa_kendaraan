const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment")
const app = express()
const kendaraanroute = require("./kendaraan")
const adminroute = require("./admin")
const penyewaroute = require("./penyewa")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(kendaraanroute)

app.use(penyewaroute)

app.use(adminroute)

app.listen(7000, () => {
    console.log("Run on port 7000")
})