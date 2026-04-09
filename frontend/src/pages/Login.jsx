import { useEffect, useState } from "react";
import { api } from "../clients/api"; // <-- 1. Import your new central API client
import { useUser } from "../context/UserContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast"; // <-- 2. Import the toast library

function Login() {
    const [searchParams] = useSearchParams();
    const oAuthToken = searchParams.get("token"); 

    const { setUser } = useUser();
    const navigate = useNavigate();

    // --- GitHub OAuth Flow ---
    useEffect(() => {
        const getUser = async () => {
            const toastId = toast.loading("Authenticating securely...");
            try {
                // Store token so the new api.js interceptor automatically uses it
                localStorage.setItem("token", oAuthToken);

                // Fetch user via central API. 
                // (Note: old userClient was mapped to '/api/users', so we use '/users' here)
                const data = await api.get('/users'); 

                setUser(data);
                toast.success("Welcome back!", { id: toastId }); // Replaces loading toast with success
                navigate("/dashboard");
            } catch(err) {
                console.error(err);
                localStorage.removeItem("token");
                toast.error("Failed to authenticate with GitHub", { id: toastId });
            }
        };

        if (oAuthToken) getUser();
        
    }, [oAuthToken, navigate, setUser]); // Safely include dependencies

    // --- Standard Email/Password Flow ---
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging in..."); // Start loading toast

        try {
            // Use the central API client
            const data = await api.post('/users/login', form);
        
            localStorage.setItem("token", data.token);
            setUser(data.user);
            
            toast.success("Login successful!", { id: toastId });
            navigate("/dashboard");
        } catch(err) {
            console.error(err);
            // The api.js interceptor already fires an error toast, 
            // so we just need to dismiss the "Logging in..." toast here.
            toast.dismiss(toastId); 
        }
    };

    return (
        <section className="bg">
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
                    <button type="submit">Login</button>
                </div>

                <p className="alternative">
                    Don't have an account? <Link to="/register">Create an account!</Link>
                </p>

            </form>
            
            <div className="buttons mt-4 border-t border-gray-300 pt-4 dark:border-gray-700">
                <a href={`${import.meta.env.VITE_BASE_URL}/api/users/auth/github`}>
                    <button type="button">Login with GitHub</button>
                </a>
            </div>
            
        </section>
    );
}

export default Login;