import express from "express"
import {amount as cps_amount, pay as cps_pay} from './cpsenergy.js'
import {amount as saws_amount, pay as saws_pay} from './saws.js'
import path from 'path'
import {parse_url} from './dcl2glb.js'
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))

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

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get("/model", async (req, res) => {
	const response = await parse_url(req.query.url)
	res.status(200).json(response);
})

app.get("/billing", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/billing.html'))
})

app.get("/pricing", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/pricing.html'))
})


app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})