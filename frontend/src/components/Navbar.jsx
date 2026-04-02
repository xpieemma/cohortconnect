import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import ThemeToggle from "./ThemeToggler"
import logo from '../assets/logo.png'

function Navbar() {

    const { user, logout } = useUser()

    return (
        <>
            <nav className="flex justify-left items-center gap-4 py-4 mb-4 border-b border-b-gray-200 pr-4">
                <img src={logo} className="w-40 h-auto m-2 mr-auto" />
                <ul className="flex justify-center items-end gap-4">
                    {user ?
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li onClick={logout}><Link to="/login">Logout</Link></li>
                            <li className="float-right"><ThemeToggle /></li>
                        </>
                        :
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    }
                </ul>
            </nav>
        </>
    )
}

export default Navbar