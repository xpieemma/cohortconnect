import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { projectClient } from "../clients/api"
import { useState } from "react"
import Task from "../components/Task"
import TaskForm from "../components/TaskForm"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
import { isProjectOwner } from "../utils/projectAuth"
import ProjectForm from "../components/ProjectForm"
import ProgressBar from "../components/ProgressBar/ProgressBar"

function ProjectDetail() {
    const { user } = useUser()
    const { projectId } = useParams()
    const [ project, setProject ] = useState(null)
    const [ tasks, setTasks ] = useState([])
    const { startLoading, stopLoading } = useLoading()

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
        const getData = async () => {
            startLoading()
            try {
                await getProjectData()
                await getTaskData()
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
            finally {
                stopLoading()
            }
        }
        getData()
    }, [projectId])

    const totalTasks = tasks.length;
    const completedTasks = tasks.length>0 ? tasks.filter(task => task.status === 'Done').length : tasks.length

    return (
        <>
            {project &&
            <>
                <h1>Project: {project.name}</h1>

                <section id="project-details">
                    <p><span className="label">Description:</span> {project.description}</p>
                    <div className="details">
                        <p><span className="label">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                        <p><span className="label">Owner:</span> {project.owner.username}</p>
                        <p><span className="label">Collaborators:</span>
                        {project.collaborators.length>0 ?
                            <> {project.collaborators.map(user => user.username).join(", ")}</>
                            :
                            <> None</>
                        }
                        </p>
                        <p><span className="label">Permissions:</span>
                            <span className="highlight">
                            {isProjectOwner(project.owner,user._id) ?
                                <> You are the owner of this project, and have full permissions.</>
                                :
                                <> You are a collaborator and only have access to update tasks statuses.</>
                            }
                            </span>
                        </p>
                        {isProjectOwner(project.owner,user._id) && 
                            <div className="buttons">
                                <ProjectForm setProjects={setProject} project={project} btnText={'Update Project'} headingText={'Update Project'} />
                                <TaskForm projectId={projectId} setTasks={setTasks} btnText={'Add Task'} headingText={'Add New Task'} />
                            </div>
                        }
                    </div>
                    <ProgressBar total={totalTasks} completed={completedTasks} />
                </section>

                <section id="project-tasks">
                    <h2>Tasks</h2>
                    {tasks.length > 0 ?
                        <ul>
                            {tasks.map(task => <Task key={task._id} task={task} setTasks={setTasks} />)}
                        </ul>
                        :
                        <p>Currently no tasks assigned to this project.</p>
                    }
                </section>
            </>
            }
        </>
    )
}

export default ProjectDetail