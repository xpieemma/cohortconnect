import { useState } from "react"
import { projectClient } from "../clients/api"

function ProjectForm({ setProjects }) {

    const [form, setForm] = useState({
        name: '',
        description: ''
    })
    
    
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
            const { data } = await projectClient.post('/', form)
            setProjects(prev => [...prev, data])
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

                <button>Submit</button>

            </form>
        </>
    )
}

export default ProjectForm