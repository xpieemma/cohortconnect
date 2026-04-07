import { userClient } from "../clients/api"
import { useUser } from "../context/UserContext"

function Profile() {
    const { user, logout } = useUser()

    const handleDelete = async () => {
        try {
            await userClient.delete(`/${user._id}`)
            logout()
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }
    
    return (
        <>
            <h1>User Profile</h1>
            {
                user &&
                <section className="bg">
                    <p><span className="label">Username:</span> {user.username}</p>
                    <p><span className="label">Email:</span> {user.email}</p>
                    <p><span className="label">Permissions:</span> {user.permissions}</p>
                    <p><span className="label">githubId:</span> {user.githubId}</p>
                    <p><span className="label">Email:</span> {user.email}</p>
                    <button onClick={handleDelete}>Delete Account</button>
                </section>
            }
        </>
    )
}

export default Profile