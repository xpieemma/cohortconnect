import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { organizationClient } from "../clients/api"
import { useState } from "react"
import Cohort from "../components/Cohort"
import CohortForm from "../components/CohortForm"
import { useUser } from "../context/UserContext"
import { useLoading } from "../context/LoadingContext"
// import { isOrganizationAdmin } from "../utils/organizationAuth"
import OrganizationForm from "../components/OrganizationForm"

function OrganizationDetail() {
    const { user } = useUser()
    const { organizationId } = useParams()
    const [ organization, setOrganization ] = useState(null)
    const [ cohorts, setCohorts ] = useState([])
    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        const getOrganizationData = async () => {
            try {
                const { data } = await organizationClient.get(`/${organizationId}`)
                setOrganization(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        const getCohortData = async () => {
            try {
                const { data } = await organizationClient.get(`/${organizationId}/cohorts`)
                setCohorts(data)
            }
            catch(err) {
                console.dir(err)
                alert(err.response.data.message)
            }
        }
        const getData = async () => {
            startLoading()
            try {
                await getOrganizationData()
                await getCohortData()
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
    }, [organizationId])


    return (
        <>
            {organization &&
            <>
                <h1>Organization: <span className="organization-name">{organization.name}</span></h1>

                <section id="organization-details">
                    {/* <p><span className="label">Description:</span> {organization.description}</p> */}
                    <div className="details">
                        {/* <p><span className="label">Created:</span> {new Date(organization.createdAt).toLocaleDateString()}</p> */}
                        <p><span className="label">Permissions:</span>
                            <span className="highlight">
                            {user.permissions === 'admin' &&
                                <> You have full permissions.</>
                            }
                            </span>
                        </p>
                        {user.permissions === 'admin' && 
                            <div className="buttons">
                                <OrganizationForm setOrganizations={setOrganization} organization={organization} btnText={'Update Organization'} headingText={'Update Organization'} />
                                <CohortForm organizationId={organizationId} setCohorts={setCohorts} btnText={'Add Cohort'} headingText={'Add New Cohort'} />
                            </div>
                        }
                    </div>
                </section>

                <section id="organization-cohorts">
                    <h2>Cohorts</h2>
                    {cohorts.length > 0 ?
                        <ul>
                            {cohorts.map(cohort => <Cohort key={cohort._id} cohort={cohort} setCohorts={setCohorts} isAdmin={user.permissions === 'admin'} />)}
                        </ul>
                        :
                        <p>Currently no cohorts assigned to this organization.</p>
                    }
                </section>
            </>
            }
        </>
    )
}

export default OrganizationDetail