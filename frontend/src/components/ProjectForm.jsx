import { useState, useEffect } from "react"
import { projectClient, userClient } from "../clients/api"
import { useUser } from "../context/UserContext";
import { useLoading } from "../context/LoadingContext"
import { useForm } from "../hooks/useForm";
import './Modal/Modal.css'

function ProjectForm({ project, setProjects, btnText = '+', headingText = 'Project' }) {
    const { user } = useUser()
    const { startLoading, stopLoading } = useLoading()
    const [ users, setUsers ] = useState([])
    const {
            modal,
            toggleModal,
            form,
            setForm,
            collaborators,
            setCollaborators,
            handleCheckboxChange,
            resetForm,
            handleChange
    } = useForm('project',project)
    
    useEffect(() => {
        if(user && user._id !== undefined){
            async function getUserList() {
                try {

                    // get a list of users from the database
                    const { data } = await userClient.get('/list')

                    // remove the current user from the list of users
                    setUsers(data.filter(u => u._id !== user._id))                

                }
                catch(err) {
                    console.dir(err)
                }
            }
            getUserList()
        }
    }, [user])

    useEffect(() => {
        if(modal) {
            document.body.classList.add('active-modal')
        }
        else {
            document.body.classList.remove('active-modal')
        }

        return () => document.body.classList.remove('active-modal')
    }, [modal])

    useEffect(() => {
        if(project) {
            setForm(project)
            setCollaborators(project.collaborators.map(callaborator => callaborator._id))
        }
    }, [project])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            startLoading()

            if(project) {
            // if updating existing project

                // send the form data to our backend
                const { data } = await projectClient.put(`/${project._id}`, {...form, collaborators: collaborators})
                
                // update the projects state
                setProjects(prev => {
                    // check if the state is an array of projects of a single project
                    return Array.isArray(prev) ?
                    prev.map(proj => proj._id === data._id ? data : proj )
                    :
                    data
                })
                
                // reset the form fields
                resetForm(data)
            }
            else {
            // else, if adding new project

                // send the form data to our backend
                const { data } = await projectClient.post('/', {...form, collaborators: collaborators})
            
                // update the projects state
                setProjects(prev => [...prev, data])
                
                // reset the form fields
                resetForm()
            }

            // close the modal
            toggleModal()
        }
        catch(err) {console.log(form)
            console.dir(err)
            alert(err.response.data.message)
        }
        finally {
            stopLoading()
        }
    }

    // const btnText = project ? 'Update' : 'Add Project'
    // const headingText = project ? 'Update Project' : 'Add New Project'

    return (
        <>
            <button onClick={toggleModal}>{btnText}</button>

            {
                modal && 
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">

                        <h3>{headingText}</h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-row">
                                <label htmlFor="name">Name:</label>
                                <input
                                    value={form.name}
                                    onChange={handleChange}
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
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
                                <fieldset>
                                    <legend>Collaborators:</legend>
                                    
                                    {users.map(user => (
                                    <div key={user._id}>
                                        <label htmlFor={`collaborators_${user._id}`}>
                                        <input
                                            type="checkbox"
                                            id={`collaborators_${user._id}`}
                                            value={user._id}
                                            checked={collaborators.includes(user._id)}
                                            onChange={(e) => handleCheckboxChange(e)}
                                        />
                                        {user.username}</label>
                                    </div>
                                    ))}
                                </fieldset>
                            </div>

                            <div className="buttons">
                                <button type="submit">Submit</button>
                                <button type="reset" onClick={()=>resetForm()}>Cancel</button>
                            </div>

                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ProjectForm