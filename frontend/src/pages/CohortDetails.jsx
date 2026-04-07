import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { cohortClient, userClient } from "../clients/api"
import { useState } from "react"
import Cohort from "../components/Cohort"
import CohortForm from "../components/CohortForm"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
import MemberCard from "../components/MemberCard"
// import { isCohortAdmin } from "../utils/cohortAuth"

function CohortDetail() {
    const { user, setUser, logout } = useUser()
    const { cohortId } = useParams()
    const [ cohort, setCohort ] = useState(null)
    const [ qaList, setQaList ] = useState([])
  const [userAnswers, setUserAnswers] = useState([]);
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        const getCohortData = async () => {
            try {
                const { data } = await cohortClient.get(`/${cohortId}`)
                setCohort(data)
                setQaList(data.passcode)
                setUserAnswers(new Array(data.passcode.length).fill(""))
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        // const getCohortData = async () => {
        //     try {
        //         const { data } = await cohortClient.get(`/${cohortId}/cohorts`)
        //         setCohorts(data)
        //     }
        //     catch(err) {
        //         console.dir(err)
        //         alert(err.response.data.message)
        //     }
        // }
        const getData = async () => {
            startLoading()
            try {
                await getCohortData()
                // await getCohortData()
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
    }, [cohortId])

    const handleChange = (index, value) => {
        const nextAnswers = [...userAnswers];
        nextAnswers[index] = value;
        setUserAnswers(nextAnswers);
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Compare userAnswers back to qaList
        const allCorrect = userAnswers.every((userInput, index) => {
            const isCorrect = userInput.trim().toLowerCase() === qaList[index].answer.toLowerCase();
            return isCorrect;
        })

        if (allCorrect) {
            const joinCohort = async () => {
                try {
                // run Axios call
                const response = await userClient.put(`/${user._id}/${cohortId}`, { data: userAnswers });
                console.log('Success!', response.data);
                alert('Great! You have been added. Login again');
                logout()
            
                // use the token to cerify the user (is token valid? is it expired?)
                // const { data } = await userClient.get('/')
                    
                // if verified that token is legit, take the user data and save it to state
                // setUser(data)

                } catch (err) {
                console.error('API Error:', err);
                }
            }
            joinCohort()
            setUser((prev) => {
                const cohorts = [...prev.cohorts, cohort]
                return {...prev, cohorts: cohorts}
            })
            setCohort((prev) => {
                const users = [...prev.users, user]
                return {...prev, users: users}
            })
        } else {
            alert('Some answers are incorrect. Please try again.');
        }

    }

console.log(user);

    return (
        <>
            {cohort &&
            <>
                <h1>Cohort: <span className="cohort-name">{cohort.name}</span></h1>

                <section id="cohort-users">
                    {user.cohorts.some(c => c?._id?.toString() === cohort?._id?.toString()) ?
                    <>
                    <h2>Members</h2>
                    {cohort.users.length > 0 ?
                        <ul>
                            {cohort.users.map(user => <MemberCard key={user._id} member={user} />)}
                        </ul>
                        :
                        <p>Currently no cohorts members.</p>
                    }
                    </>
                    :
                    <>
                    <h2>Answer Passcode to Join</h2>
                    <form className="card" onSubmit={handleSubmit}>
                        {qaList.map((pc,index) => 
                            <div key={index} className="form-row">
                                <label htmlFor="answer">{pc.question}</label>
                                <input type="text" id="answer" name="answer" value={userAnswers[index]} onChange={(e) => handleChange(index, e.target.value)} />
                            </div>
                        )}
                        <button>Submit</button>
                    </form>
                    </>
                    }
                </section>
            </>
            }
        </>
    )
}

export default CohortDetail