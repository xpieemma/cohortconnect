import { useState, useEffect } from "react"
import { projectClient, userClient } from "../clients/api"
import { useUser } from "../context/UserContext";
import { useForm } from "../hook/useForm";
import './Modal/Modal.css'

function ProjectForm({ setProjects }) {
    const { user } = useUser()
    const [ users, setUsers ] = useState([])
    const {
            modal,
            toggleModal,
            form,
            collaborators,
            handleCheckboxChange,
            resetForm,
            handleChange
    } = useForm('project')
    
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // send the form data to our backend
            const { data } = await projectClient.post('/', {...form, collaborators: collaborators})
            
            // update the projects state
            setProjects(prev => [...prev, data])
            
            // clear the form fields
            resetForm()

            // close the modal
            toggleModal(false)
        }
        catch(err) {console.log(form)
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <button onClick={toggleModal}>Add Project</button>

            {
                modal && 
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">
                        <button onClick={toggleModal}>Close</button>
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

                            <button type="submit">Submit</button>
                            <button type="reset" onClick={resetForm}>Cancel</button>

                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ProjectForm