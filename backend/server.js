import 'dotenv/config'
import express, { json } from 'express'
import './config/connection.js'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import cohortRoutes from './routes/cohortRoutes.js'
import organizationRoutes from './routes/organizationRoutes.js'
import githubRoutes from './routes/githubRoutes.js'

const app = express()
const port = process.env.PORT || 3000;

app.use(cors({ origin: [process.env.CLIENT_ORIGIN, 'http://localhost:5173'] }))
app.use(json())

// mount routes
app.use('/api/organizations', organizationRoutes)
app.use('/api/cohorts', cohortRoutes)
app.use('/api/users/github', githubRoutes)
app.use('/api/users', userRoutes)
 
// frontend (oAuth login page)
app.get('/', (req, res) => res.send('<a href="/api/users/auth/github"><button>Login with GitHub</button></a>'))
 
// frontend (oAuth success page)
app.get('/success', (req, res) => res.send('<h1>Success!</h1><a href="/">Back</a>'))

app.listen(port, () => {
    console.log("Server listening at http://localhost:" + port)
})