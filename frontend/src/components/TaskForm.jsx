import { useState } from "react"
import { projectClient } from "../clients/api"

function TaskForm({ projectId, setTasks }) {

    const [form, setForm] = useState({
        title: '',
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
            const { data } = await projectClient.post(`/${projectId}/tasks`, form)
            setTasks(prev => [...prev, data])
            setForm({
                title: '',
                description: ''
            })
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
                    <label htmlFor="title">Title:</label>
                    <input
                        value={form.title}
                        onChange={handleChange}
                        id="title"
                        name="title"
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
                    <label htmlFor="status">Status:</label>
                    <select
                        value={form.status}
                        onChange={handleChange}
                        id="status"
                        name="status"
                        type="text"
                        required
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <button>Submit</button>

            </form>
        </>
    )
}

export default TaskForm