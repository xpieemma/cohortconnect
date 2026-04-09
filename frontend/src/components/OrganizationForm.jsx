import { useState, useEffect } from "react"
import { organizationClient, userClient } from "../clients/api"
import { useUser } from "../context/UserContext";
import { useLoading } from "../context/LoadingContext"
import { useForm } from "../hooks/useForm";
import './Modal/Modal.css'
import {api} from "../clients/api"

function OrganizationForm({ organization, setOrganizations, btnText = '+', headingText = 'Project' }) {
    const { user } = useUser()
    const { startLoading, stopLoading } = useLoading()
    const [ setUsers ] = useState([])
    const {
            modal,
            toggleModal,
            form,
            setForm,
            collaborators,
            resetForm,
            handleChange
    } = useForm('organization',organization)
    
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
        if(organization) {
            setForm(organization)
        }
    }, [organization])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            startLoading()

            if(organization) {
            // if updating existing organization

                // send the form data to our backend
                const { data } = await organizationClient.put(`/${organization._id}`, {...form, collaborators: collaborators})
                
                // update the organizations state
                setOrganizations(prev => {
                    // check if the state is an array of organizations of a single organization
                    return Array.isArray(prev) ?
                    prev.map(proj => proj._id === data._id ? data : proj )
                    :
                    data
                })
                
                // reset the form fields
                resetForm(data)
            }
            else {
            // else, if adding new organization

                // send the form data to our backend
                const { data } = await api.post('/organizations', {...form, collaborators: collaborators})
            
                // update the organizations state
                setOrganizations(prev => [...prev, data])
                
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

    // const btnText = organization ? 'Update' : 'Add Project'
    // const headingText = organization ? 'Update Project' : 'Add New Project'

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

                            {/* <div className="form-row">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    value={form.description}
                                    onChange={handleChange}
                                    id="description"
                                    name="description"
                                    required
                                />
                            </div> */}

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

export default OrganizationForm