import { useEffect, useState } from "react"
import { userClient } from "../clients/api"
import { useUser } from "../context/UserContext"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'

function Login() {

    const [searchParams] = useSearchParams();

    // Get a specific parameter's value
    const oAuthToken = searchParams.get("token"); 

    const { setUser } = useUser()

    const navigate = useNavigate()

    useEffect(() => {

        const getUser = async () => {
            try {

                const { data } = jwtDecode(oAuthToken);
            
                // take the token and store it locally
                localStorage.setItem("token", oAuthToken)

                // verify user on backend
                // const { data } = await userClient.get('/')

                // save some user data in our state
                setUser(data)
                console.log(data);
                
                // navigate to the feed
                navigate("/dashboard")

            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        if(oAuthToken) {
            getUser()
        }
        
    }, [])

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            // send the form data to our backend
            const { data } = await userClient.post('/login', form)
        
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
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

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
                        autoComplete="current-password"
                        required
                    />
                </div>

                <div className="buttons">
                    <button>Login</button>
                </div>

                <p className="alternative">Don't have an account? <Link to="/register">Create an account!</Link></p>

            </form>
            
            <div className="buttons">
                <a href={import.meta.env.VITE_BASE_URL+"/api/users/auth/github"}><button>Login with GitHub</button></a>
            </div>
            
        </section>
    )
}

export default Login