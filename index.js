import express from "express"
import {amount as cps_amount, pay as cps_pay} from './cpsenergy.js'
import {amount as saws_amount, pay as saws_pay} from './saws.js'

const PORT = process.env.PORT || 5000
const app = express()

app.get("/saws_amount", async (req, res) => {
	const response = await cps_amount('Rajashekara', 'Divinespot60$')
	if(response == null){
		res.status(400).json(response)
	}
  res.status(200).json(response)
})

app.get("/cps_amount", (req, res) => {
	const response = await saws_amount('001021658-0721990-0003', '78023')
	res.send("")
})

app.get("saws")

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})