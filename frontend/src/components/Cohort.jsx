import { Link } from "react-router-dom"
import { cohortClient, organizationClient } from "../clients/api"
import { useEffect, useState } from "react"
import { useLoading } from "../context/LoadingContext"
import CohortForm from "./OrganizationForm"

function Cohort({ cohort, setCohorts, isAdmin = false, hasJoined = false }) {
    const { startLoading, stopLoading } = useLoading()
    const [passcode, setPasscode] = useState({question: '', answer: ''})



    const handleDelete = async () => {
        try {
            startLoading()
            // remove cohort from database
            await cohortClient.delete(`/${cohort._id}`)
            // remove cohort from state
            setCohorts(cohorts => cohorts.filter(c => c._id !== cohort._id))
        }
        catch(err) {
            console.dir(err)
            alert(err.response.data.message)
        }
        finally {
            stopLoading()
        }
    }

  const handleAddPasscode = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
        startLoading();
        await cohortClient.put(`/${cohort._id}`, { passcode: [...cohort.passcode, passcode] });

        // Fix inverted logic and append correctly
        setCohorts(cohorts => cohorts.map(c => 
            c._id === cohort._id ? { ...c, passcode: [...c.passcode, passcode] } : c
        ));
        setPasscode({ question: '', answer: '' });
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
                <h3><Link to={`/cohort/${cohort._id}`}>{cohort.organization.name}: {cohort.name}</Link></h3>
                <div className="details">
                    {
                        (cohort.length>0) &&
                        <p><span class="label">Cohorts:</span> {cohort.length}</p>
                    }
                </div>
                <div className="buttons">
                    <Link to={`/cohort/${cohort._id}`}>
                    
                    {isAdmin ?
                        <button>View</button>
                        :
                        hasJoined ? <button>View</button> : <button>Join</button>
                    }
                    
                    </Link>
                    {
                        isAdmin &&
                        <>
                            {/* <CohortForm setCohorts={setCohorts} cohort={cohort} btnText={'Edit'} headingText={'Update Cohort'} /> */}
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    }
                </div>
                {
                    isAdmin &&
                    <>
                        {cohort.passcode.length}
                        {cohort.passcode.map((passcode, index) =>
                        <p key={index}><span className="label">Passcodes:</span> {passcode.question} {passcode.answer}</p>
                        )}
                        <form onSubmit={handleAddPasscode}>
                            <div className="form-row">
                            <label htmlFor="question">Question: </label>
                            <input type="text" id="question" name="question" value={passcode.question} onChange={(e)=>setPasscode(prev => {return {...prev, [e.target.name]: e.target.value}})} />
                            </div>
                            <div className="form-row">
                            <label htmlFor="question">Answer: </label>
                            <input type="text" id="answer" name="answer" value={passcode.answer} onChange={(e)=>setPasscode(prev => {return {...prev, [e.target.name]: e.target.value}})} />
                            </div>
                            <button>Add</button>
                        </form>
                    </>
                }
            </li>
        </>
    )
}

export default Cohort