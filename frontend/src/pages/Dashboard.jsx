import { useQuery } from '@tanstack/react-query';
import { api } from '../clients/api';
import { useUser } from '../context/UserContext';
import OrganizationForm from "../components/OrganizationForm";
import Organization from "../components/Organization";
import Cohort from "../components/Cohort";

function Dashboard() {
    const { user } = useUser();

    // React Query handles fetching, caching, and loading states automatically
    const { data: organizations = [], isLoading: orgsLoading } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => api.get('/organizations'),
        enabled: user?.permissions === 'admin' // Only fetch if admin!
    });

    const { data: cohorts = [], isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts'],
        queryFn: () => api.get('/cohorts')
    });

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['userCohorts', user?._id],
        queryFn: () => api.get('/users') // Assuming this returns the populated user object
    });

    const userCohorts = userData?.cohorts || [];
    const isLoading = orgsLoading || cohortsLoading || userLoading;

    if (isLoading) return <p className="text-center mt-10">Loading dashboard...</p>;

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome {user.username}! Create projects, tasks, and collaborate with others.</p>
            
            {user.permissions === 'admin' && (
                <section id="organization-list">
                    <h2>Organizations</h2>
                    <div className="buttons">
                        <OrganizationForm btnText={'Add Organization'} headingText={'Add New Organization'} />
                    </div>
                    {organizations.length > 0 ? (
                        <ul>
                            {organizations.map(org => (
                                <Organization key={org._id} organization={org} isAdmin={true} />
                            ))}
                        </ul>
                    ) : (
                        <p>There are currently no organizations.</p>
                    )}
                </section>
            )}

            <section id="cohort-list">
                <h2>My Cohorts</h2>
                {userCohorts.length > 0 ? (
                    <ul>
                        {userCohorts.map(cohort => (
                            <Cohort key={cohort._id} cohort={cohort} isAdmin={user.permissions === 'admin'} hasJoined={true} />
                        ))}
                    </ul>
                ) : (
                    <p>You haven't joined any cohorts.</p>
                )}
            </section>

            <section id="cohort-list">
                <h2>All Cohorts</h2>
                {cohorts.length > 0 ? (
                    <ul>
                        {cohorts.map(cohort => (
                            <Cohort 
                                key={cohort._id} 
                                cohort={cohort} 
                                isAdmin={user.permissions === 'admin'} 
                                // Fix applied here: checking against uc._id
                                hasJoined={userCohorts.some(uc => uc._id === cohort._id)} 
                            />
                        ))}
                    </ul>
                ) : (
                    <p>There are currently no cohorts.</p>
                )}
            </section>
        </>
    );
}

export default Dashboard;