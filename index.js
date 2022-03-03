import express from "express"
import {amount as cps_amount, pay as cps_pay} from './cpsenergy.js'
import {amount as saws_amount, pay as saws_pay} from './saws.js'

const PORT = process.env.PORT || 3000
const app = express()

app.get("/cps_amount", async (req, res) => {
	try{
		const response = await cps_amount(req.query.username, req.query.password)
		res.status(200).json(response)
	}catch{
		res.status(400)
	}
})

app.get("/saws_amount", async (req, res) => {
	try{
		const response = await saws_amount(req.query.account, req.query.zip_code)
		res.status(200).json(response)
	}catch{
		res.status(400)
	}
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})