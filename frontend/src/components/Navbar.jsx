import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import ThemeToggle from "./ThemeToggler"
import logo from '../assets/logo.png'

function Navbar() {

    const { user, logout } = useUser()

    return (
        <>
            <nav className="">
                <img src={logo} className="w-40 h-auto m-2 sm:mr-auto dark:brightness-0 dark:invert" />
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