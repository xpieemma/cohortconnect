import { Link } from "react-router-dom"
import { organizationClient } from "../clients/api"
import { useEffect } from "react"
import { useState } from "react"
import { useLoading } from "../context/LoadingContext"
import OrganizationForm from "./OrganizationForm"

function Organization({ organization, setOrganizations, isAdmin = false }) {
    const [tasks, setTasks] = useState([])
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        const getTaskData = async () => {
            startLoading()
            try {
                const { data } = await organizationClient.get(`/`)
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
            // remove organization from database
            await organizationClient.delete(`/${organization._id}`)
            // remove organization from state
            setOrganizations(prev => prev.filter(org => org._id !== organization._id))
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
        <>
            <li className="card">
                <h3><Link to={`/organization/${organization._id}`}>{organization.name}</Link></h3>
                {/* <p><span className="label">Description:</span> {organization.description}</p> */}
                <div className="details">
                    {/* <p><span class="label">Owner:</span> {organization.owner.username}</p>
                    {
                        (tasks.length>0) &&
                        <p><span class="label">Tasks:</span> {tasks.length}</p>
                    }
                    {
                        (organization.collaborators.length>0) &&
                        <p><span class="label">Collaborators:</span> {organization.collaborators.length}</p>
                    } */}
                </div>
                <div className="buttons">
                    <Link to={`/organization/${organization._id}`}><button>View Details</button></Link>
                    {
                        isAdmin &&
                        <>
                            <OrganizationForm setOrganizations={setOrganizations} organization={organization} btnText={'Edit'} headingText={'Update Organization'} />
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    }
                </div>
            </li>
        </>
    )
}

export default Organization