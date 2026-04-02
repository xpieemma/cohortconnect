import { useEffect } from "react"
import { projectClient, taskClient } from "../clients/api"
import { useForm } from "../hooks/useForm"
import './Modal/Modal.css'

function TaskForm({ projectId, setTasks, task, btnText = '+', headingText = 'Task'  }) {
    const {
        modal,
        toggleModal,
        form,
        setForm,
        resetForm,
        handleChange
    } = useForm('task',task)
    
    useEffect(() => {
        if(task) {
            setForm(task)
        }
    }, [task])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            if(task){
                // send the form data to our backend
                const { data } = await taskClient.put(`/${task._id}`, form)
                setTasks(prev => prev.map(task => task._id === data._id ? data : task))
                resetForm(data)
            }
            else {
                // send the form data to our backend
                const { data } = await projectClient.post(`/${projectId}/tasks`, form)
                setTasks(prev => [...prev, data])
                resetForm()
            }
            
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <button onClick={toggleModal}>{btnText}</button>

            {modal &&
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">

                        <button onClick={toggleModal}>Close</button>

                        <h3>{headingText}</h3>

                        <form onSubmit={handleSubmit}>

                            <div className="form-row">
                                <label htmlFor="title">Title:</label>
                                <input
                                    value={form.title}
                                    onChange={handleChange}
                                    id="title"
                                    name="title"
                                    type="text"
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
                                <label htmlFor="status">Status:</label>
                                <select
                                    value={form.status}
                                    onChange={handleChange}
                                    id="status"
                                    name="status"
                                    type="text"
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>

                            <button type="submit">Submit</button>
                            <button type="reset" onClick={()=>resetForm()}>Cancel</button>

                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default TaskForm