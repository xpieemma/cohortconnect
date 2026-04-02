import { Link } from "react-router-dom"
import { projectClient } from "../clients/api"
import { useEffect } from "react"
import { useState } from "react"
import ProjectForm from "./ProjectForm"
import ProgressBar from "./ProgressBar/ProgressBar"

function Project({ project, setProjects, isOwner }) {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTaskData = async () => {
            try {
                const { data } = await projectClient.get(`/${project._id}/tasks`)
                setTasks(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        getTaskData()
    },[])

    const handleDelete = async () => {
        try {
            // remove project from database
            await projectClient.delete(`/${project._id}`)
            // remove project from state
            setProjects(projects => projects.filter(p => p._id !== project._id))
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.length>0 ? tasks.filter(task => task.status === 'Done').length : tasks.length

    return (
        <>
            <li className="card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Owner: {project.owner.username}</p>
                {
                    (project.collaborators.length>0) &&
                    <p>{project.collaborators.length} Collaborator{project.collaborators.length>1 ? 's' : ''}</p>
                }
                {
                    (tasks.length>0) &&
                    <p>{tasks.length} Task{tasks.length>1 ? 's' : ''}</p>
                }
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