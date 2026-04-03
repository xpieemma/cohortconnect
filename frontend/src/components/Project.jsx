import { Link } from "react-router-dom"
import { projectClient } from "../clients/api"
import { useEffect } from "react"
import { useState } from "react"
import { useLoading } from "../context/LoadingContext"
import ProjectForm from "./ProjectForm"
import ProgressBar from "./ProgressBar/ProgressBar"

function Project({ project, setProjects, isOwner }) {
    const [tasks, setTasks] = useState([])
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        const getTaskData = async () => {
            startLoading()
            try {
                const { data } = await projectClient.get(`/${project._id}/tasks`)
                setTasks(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
            finally {
                stopLoading()
            }
        }
        getTaskData()
    },[])

    const handleDelete = async () => {
        try {
            startLoading()
            // remove project from database
            await projectClient.delete(`/${project._id}`)
            // remove project from state
            setProjects(projects => projects.filter(p => p._id !== project._id))
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
        finally {
            stopLoading()
        }
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.length>0 ? tasks.filter(task => task.status === 'Done').length : tasks.length

    return (
        <>
            <li className="card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="details">
                    <p><span class="label">Owner:</span> {project.owner.username}</p>
                    {
                        (tasks.length>0) &&
                        <p><span class="label">Tasks:</span> {tasks.length}</p>
                    }
                    {
                        (project.collaborators.length>0) &&
                        <p><span class="label">Collaborators:</span> {project.collaborators.length}</p>
                    }
                </div>
                <div className="buttons">
                    <Link to={`/project/${project._id}`}><button>View Details</button></Link>
                    {
                        isOwner &&
                        <>
                            <ProjectForm setProjects={setProjects} project={project} btnText={'Edit'} headingText={'Update Project'} />
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    }
                </div>
                <ProgressBar total={totalTasks} completed={completedTasks} />
            </li>
        </>
    )
}

export default Project