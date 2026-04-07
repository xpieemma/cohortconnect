import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
import { organizationClient } from "../clients/api"
import { cohortClient } from "../clients/api"
import { userClient } from "../clients/api"
// import Project from "../components/Project"
import OrganizationForm from "../components/OrganizationForm"
import { isProjectOwner } from "../utils/organizationAuth"
import Organization from "../components/Organization"
import Cohort from "../components/Cohort"

function Dashboard() {

    const { user } = useUser()
    const [organizations, setOrganizations] = useState([])
    const [cohorts, setCohorts] = useState([])
    const [userCohorts, setUserCohorts] = useState([])
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        async function getData() {
            startLoading()
            try {
                // get organizations
                const { data: organizationsData } = await organizationClient.get('/')

                // get cohorts
                const { data: cohortsData } = await cohortClient.get('/')

                // get user's cohorts
                const { data: userCohortsData } = await userClient.get('/')

                // save organizations component's state
                setOrganizations(organizationsData)    

                // save cohorts component's state
                setCohorts(cohortsData)    

                // save user's cohorts component's state
                setUserCohorts(userCohortsData.cohorts)    
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

    console.log(user)

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {user.username}! Create projects, tasks, and collaborate with others.</p>
            
            
            {user.permissions === 'admin' &&
            <section id="organization-list">
                <h2>Organizations</h2>
                <div className="buttons">
                    <OrganizationForm setOrganizations={setOrganizations} btnText={'Add Organization'} headingText={'Add New Organization'} />
                </div>
                {organizations.length>0 ?
                    <ul>
                        {organizations.map(organization =>
                            <Organization
                                key={organization._id}
                                organization={organization}
                                setOrganizations={setOrganizations}
                                isAdmin={user.permissions === 'admin'}
                            />
                        )}
                    </ul>
                    :
                    <p>There are currently no organizations.</p>
                }
            </section>}

            <section id="cohort-list">
                <h2>My Cohorts</h2>
                {userCohorts.length>0 ?
                    <ul>
                        {userCohorts.map(cohort =>
                            <Cohort
                                key={cohort._id}
                                cohort={cohort}
                                setCohorts={setCohorts}
                                isAdmin={user.permissions === 'admin'}
                                hasJoined={true}
                            />
                        )}
                    </ul>
                    :
                    <p>You haven't joined any cohorts.</p>
                }
            </section>

            <section id="cohort-list">
                <h2>All Cohorts</h2>
                {cohorts.length>0 ?
                    <ul>
                        {cohorts.map(cohort =>
                            <Cohort
                                key={cohort._id}
                                cohort={cohort}
                                setCohorts={setCohorts}
                                isAdmin={user.permissions === 'admin'}
                                hasJoined={userCohorts.some(cohort => cohort._id === cohort._id)}
                            />
                        )}
                    </ul>
                    :
                    <p>There are currently no cohorts.</p>
                }
            </section>
        </>
    )
}

export default Dashboard