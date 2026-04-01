import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { projectClient } from "../clients/api"
import { useState } from "react"
import Task from "../components/Task"
import TaskForm from "../components/TaskForm"
import { useUser } from "../context/UserContext"
import { isProjectOwner } from "../utils/projectAuth"

function ProjectDetail() {
    const { user } = useUser()
    const { projectId } = useParams()
    const [ project, setProject ] = useState({})
    const [ tasks, setTasks ] = useState([])

    useEffect(() => {
        const getProjectData = async () => {
            try {
                const { data } = await projectClient.get(`/${projectId}`)
                setProject(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        const getTaskData = async () => {
            try {
                const { data } = await projectClient.get(`/${projectId}/tasks`)
                setTasks(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        getProjectData()
        getTaskData()
    }, [])

    const isOwner = isProjectOwner(project.owner,user._id)

    return (
        <>
            <h1>{project.name}</h1>

            <section id="project-details">
                <p>Description: {project.description}</p>
                <p>Permissions:
                    {isOwner ?
                        <> You the owner of this project, and have full permissions.</>
                        :
                        <> You are a collaborator and only have access to update task status.</>
                    }
                </p>
                <p>Collaborators:
                {(project.collaborators && project.collaborators.length>1) ?
                    <> {project.collaborators.map(user => user.username).join(", ")}</>
                    :
                    <> None</>
                }
                </p>
            </section>

            <section id="project-tasks">
                <h2>Project Tasks</h2>
                {isOwner && <TaskForm projectId={projectId} setTasks={setTasks} />}
                {tasks.length > 0 ?
                    tasks.map(task => <Task key={task._id} task={task} setTasks={setTasks} />)
                    :
                    <p>Currently no tasks assigned to this project.</p>
                }
            </section>
        </>
    )
}

export default ProjectDetail