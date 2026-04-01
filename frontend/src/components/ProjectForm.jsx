import { useState, useEffect } from "react"
import { projectClient, userClient } from "../clients/api"
import { useUser } from "../context/UserContext";

function ProjectForm({ setProjects }) {

    const [form, setForm] = useState({ name: '', description: '' })
    const [users, setUsers] = useState([])
    const [collaborators, setCollaborators] = useState([])
    const { user } = useUser()
    
    useEffect(() => {
        if(user && user._id !== undefined){
            async function getUserList() {
                try {

                    // get a list of users from the database
                    const { data } = await userClient.get('/list')

                    // remove the current user from the list of users
                    setUsers(data.filter(u => u._id !== user._id))                

                }
                catch(err) {
                    console.dir(err)
                }
            }
            getUserList()
        }
    }, [user])

    const handleCheckboxChange = (e) => {
        const userId = e.target.value

        if (e.target.checked) {
            // Add user
            setCollaborators(prev => [...prev, userId]);
        } else {
            // Remove user
            setCollaborators(prev => prev.filter(id => id !== userId))
        }
    }
    
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
            const { data } = await projectClient.post('/', {...form, collaborators: collaborators})
            
            // update the projects state
            setProjects(prev => [...prev, data])
            
            // clear the form fields
            setForm({ name: '', description: '' })
            setCollaborators([])
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="form-row">
                    <label htmlFor="name">Name:</label>
                    <input
                        value={form.name}
                        onChange={handleChange}
                        id="name"
                        name="name"
                        type="text"
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        value={form.description}
                        onChange={handleChange}
                        id="description"
                        name="description"
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="contributors">Collaborators:</label>
                    {users.map(user => (
                    <div key={user._id}>
                        <label>
                        <input
                            type="checkbox"
                            id={user._id}
                            value={user._id}
                            checked={collaborators.includes(user._id)}
                            onChange={(e) => handleCheckboxChange(e)}
                        />
                        {user.username}
                        </label>
                    </div>
                    ))}
                </div>

                <button>Submit</button>

            </form>
        </>
    )
}

export default ProjectForm