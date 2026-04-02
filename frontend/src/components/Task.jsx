import { useEffect } from "react"
import { taskClient, projectClient } from "../clients/api"
import { useUser } from "../context/UserContext"
import { isProjectOwner } from "../utils/projectAuth"
import TaskForm from "./TaskForm"
import { useState } from "react"

function Task({ task, setTasks }) {

    const { user } = useUser()
    const [ project, setProject ] = useState(null)
    
    useEffect(() => {
        const getProjectData = async () => {
            try {
                const { data } = await projectClient.get(`/${task.project}`)
                setProject(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        getProjectData()
    }, [])

    const handleChange = async (e) => {
        try {
            // update the tasks state
            setTasks(tasks => tasks.map(t => (t._id === task._id)?{...t, status: e.target.value}:t))
            
            // update the task in our backend
            await taskClient.put(`/${task._id}`, {status: e.target.value})
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    const handleDelete = async () => {
        try {
            // remove task from database
            await taskClient.delete(`/${task._id}`)
            // remove task from state
            setTasks(tasks => tasks.filter(t => t._id !== task._id))
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <div className="form-row">
                <label>Status:
                <select
                    value={task.status}
                    onChange={handleChange}
                    name="status"
                    type="text"
                    required
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                </label>
            </div>

            {
            project && isProjectOwner(project.owner,user._id) &&
            <div className="buttons">
                <TaskForm projectId={task.project} task={task} setTasks={setTasks} btnText={'Edit'} headingText={'Edit Task'} />
                <button onClick={handleDelete}>Delete</button>
            </div>
            }
        </>
    )
}

export default Task