import { useEffect } from "react"
import { organizationClient, cohortClient } from "../clients/api"
import { useForm } from "../hooks/useForm"
import { useLoading } from "../context/LoadingContext"
import './Modal/Modal.css'

function CohortForm({ organizationId, setCohorts, cohort, btnText = '+', headingText = 'Cohort'  }) {
    const { startLoading, stopLoading } = useLoading()
    const {
        modal,
        toggleModal,
        form,
        setForm,
        resetForm,
        handleChange
    } = useForm('cohort',cohort ? cohort : {name: '', organization: organizationId, passcode: []} )
    
    useEffect(() => {
        if(cohort) {
            setForm(cohort)
        }
    }, [cohort])

    const handleSubmit = async (e) => {
        e.preventDefault()
        startLoading()
        try {

            if(cohort){
                // send the form data to our backend
                const { data } = await cohortClient.put(`/${cohort._id}`, form)
                setCohorts(prev => prev.map(cohort => cohort._id === data._id ? data : cohort))
                resetForm(data)
            }
            else {
                // send the form data to our backend
                const { data } = await organizationClient.post(`/${organizationId}/cohorts`, form)
                setCohorts(prev => [...prev, data])
                resetForm()
            }
            
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
            <button onClick={toggleModal}>{btnText}</button>

            {modal &&
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
                                    required
                                />
                            </div>

                            <div className="form-row">
                                {/* <label htmlFor="organization">Organization:</label> */}
                                <input
                                    value={form.organization}
                                    onChange={handleChange}
                                    id="organization"
                                    name="organization"
                                    type="hidden"
                                    required
                                />
                            </div>
                            {form.passcode.length > 0 &&
                            <>
                                <div className="form-row">
                                    <label htmlFor="passcode.0.question">Passcode Question:</label>
                                    <input
                                        value={form.passcode[0].question}
                                        onChange={handleChange}
                                        id="passcode.0.question"
                                        name="passcode.0.question"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <label htmlFor="passcode.0.answer">Passcode Answer:</label>
                                    <input
                                        value={form.passcode[0].answer}
                                        onChange={handleChange}
                                        id="passcode.0.answer"
                                        name="passcode.0.answer"
                                        type="text"
                                        required
                                    />
                                </div>
                            </>
                            }
                            {/* <p onClick={()=>setForm(
                                {...form,[...form.passcode, {question: '', answer: ''}]}
                            )}>Add Passcode</p> */}

                            
                            {/* <div className="form-row">
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

export default CohortForm