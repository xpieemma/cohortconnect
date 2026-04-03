import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
import Project from "../components/Project"
import ProjectForm from "../components/ProjectForm"
import { projectClient } from "../clients/api"
import { isProjectOwner } from "../utils/projectAuth"

function Dashboard() {

    const { user } = useUser()
    const [projects, setProjects] = useState([])
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        async function getData() {
            startLoading()
            try {
                // get user posts from DB
                const { data } = await projectClient.get('/')

                // save the user's posts in the component's state
                setProjects(data)    
            }
            catch(err) {
                console.dir(err)
            }
            finally {
                stopLoading()
            }
        }
        getData()
    }, [])

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {user.username}!</p>
            
            <div className="buttons">
                <ProjectForm setProjects={setProjects} btnText={'Add Project'} headingText={'Add New Project'} />
            </div>
            
            <section>
                <h2>My Projects ({projects.length})</h2>
                {projects.length>0 ?
                    <ul>
                        {projects.map(project =>
                            <Project
                                key={project._id}
                                project={project}
                                setProjects={setProjects}
                                isOwner={isProjectOwner(project.owner,user._id)}
                            />
                        )}
                    </ul>
                    :
                    <p>You don't own any projects.</p>
                }
            </section>
        </>
    )
}

export default Dashboard