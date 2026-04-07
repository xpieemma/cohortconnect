import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import logo from '../assets/logo.png'

function Navbar() {

    const { user, logout } = useUser()

    return (
        <>
            <nav>
                <div className="content-width">
                    <div>CohortConnect</div>
                    {/* <img src={logo} alt="Pro-Tasker" className="w-40 h-auto m-2 sm:mr-auto dark:brightness-0 dark:invert" /> */}
                    <ul className="flex justify-center items-end gap-8">
                        {user ?
                            <>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/profile">Profile</Link></li>
                                <li onClick={logout}><Link to="/login">Logout</Link></li>
                            </>
                            :
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar