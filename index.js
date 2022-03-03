import express from "express"
import {amount as cps_amount, pay as cps_pay} from './cpsenergy.js'
import {amount as saws_amount, pay as saws_pay} from './saws.js'

const PORT = process.env.PORT || 3000
const app = express()

app.get("/cps_amount", async (req, res) => {
	try{
		const response = await cps_amount('Rajashekara', 'Divinespot60$')
		res.status(200).json(response)
	}catch{
		res.status(400).json(response)
	}
})

app.get("/saws_amount", async (req, res) => {
	try{
		const response = await saws_amount('001021658-0721990-0003', '78023')
		res.status(200).json(response)
	}catch{
		res.status(400).json("hello")
	}
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})