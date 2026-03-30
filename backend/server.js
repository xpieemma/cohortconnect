import express, { json } from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log("Server listening at http://localhost:" + port)
})