import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Project from "../components/Project"
import ProjectForm from "../components/ProjectForm"
import { projectClient } from "../clients/api"
import { isProjectOwner } from "../utils/projectAuth"

function Dashboard() {

    const { user } = useUser()
    const [projects, setProjects] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                // get user posts from DB
                const { data } = await projectClient.get('/')

                // save the user's posts in the component's state
                setProjects(data)    
            }
            catch(err) {
                console.dir(err)
            }
        }
        getData()
    }, [])

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {user.username}!</p>

            <ProjectForm setProjects={setProjects} />
            
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
        </>
    )
}

export default Dashboard