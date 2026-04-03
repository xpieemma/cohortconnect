import { useEffect, useState } from "react"
import { taskClient, projectClient } from "../clients/api"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
import { isProjectOwner } from "../utils/projectAuth"
import TaskForm from "./TaskForm"

function Task({ task, setTasks }) {

    const { user } = useUser()
    const [ project, setProject ] = useState(null)
    const { startLoading, stopLoading } = useLoading()
    
    useEffect(() => {
        const getProjectData = async () => {
            try {
                startLoading()
                const { data } = await projectClient.get(`/${task.project}`)
                setProject(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
            finally {
                stopLoading()
            }
        }
        getProjectData()
    }, [])

    const handleChange = async (e) => {
        try {
            startLoading()
            // update the tasks state
            setTasks(tasks => tasks.map(t => (t._id === task._id)?{...t, status: e.target.value}:t))
            
            // update the task in our backend
            await taskClient.put(`/${task._id}`, {status: e.target.value})
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
        finally {
            stopLoading()
        }
    }

    const handleDelete = async () => {
        try {
            startLoading()
            // remove task from database
            await taskClient.delete(`/${task._id}`)
            // remove task from state
            setTasks(tasks => tasks.filter(t => t._id !== task._id))
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
        finally {
            stopLoading()
        }
    }

    return (
        <li className="card">
            <h3>{task.title}</h3>

            <div className="status">
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

            <p>{task.description}</p>

            {
            project && isProjectOwner(project.owner,user._id) &&
            <div className="buttons">
                <TaskForm projectId={task.project} task={task} setTasks={setTasks} btnText={'Edit'} headingText={'Edit Task'} />
                <button onClick={handleDelete}>Delete</button>
            </div>
            }
        </li>
    )
}

export default Task