import { useState } from "react"
import { useUser } from "../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import { userClient } from "../clients/api"

function Register() {

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const { setUser } = useUser()

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // send the form data to our backend
            const { data } = await userClient.post('/register', form)
            console.log(data)
        
            // take the token and store it locally
            localStorage.setItem("token", data.token)

            // save some user data in our state
            setUser(data.user)
            
            // navigate to the feed
            navigate("/dashboard")
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    return (
        <section>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="username">Username:</label>
                    <input
                        value={form.username}
                        onChange={handleChange}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="email">Email:</label>
                    <input
                        value={form.email}
                        onChange={handleChange}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="password">Password:</label>
                    <input
                        value={form.password}
                        onChange={handleChange}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="buttons">
                    <button>Register</button>
                </div>

                <p className="alternative">Already have an account? <Link to="/login">Login!</Link></p>
                
            </form>
            
            <div className="buttons">
                <a href={import.meta.env.VITE_BASE_URL+"/api/users/auth/github"}><button>Signup with GitHub</button></a>
            </div>

        </section>
    )
}

export default Register