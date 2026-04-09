import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../clients/api";
import { useUser } from "../context/UserContext";
import MemberCard from "../components/MemberCard";
import toast from "react-hot-toast";

function CohortDetail() {
    const { user, setUser } = useUser();
    const { cohortId } = useParams();
    const queryClient = useQueryClient();

    const [userAnswers, setUserAnswers] = useState([]);

    // --- 1. Fetch Cohort Data automatically with React Query ---
    const { data: cohort, isLoading } = useQuery({
        queryKey: ['cohort', cohortId],
        queryFn: () => api.get(`/cohorts/${cohortId}`),
        enabled: !!cohortId
    });


const handleChange = (index, value) => {
    const nextAnswers = [...userAnswers];
    nextAnswers[index] = value;
    setUserAnswers(nextAnswers);
};

const handleSubmit = (e) => {
    e.preventDefault();

    // 2. Loop over the source of truth (cohort.passcode), NOT the user's answers.
    // This prevents the "empty array = true" bug.
    const allCorrect = cohort.passcode.every((pc, index) => {
        const userInput = userAnswers[index] || ""; // Safely fallback to empty string
        return userInput.trim().toLowerCase() === pc.answer.toLowerCase();
    });

    if (allCorrect) {
        joinMutation.mutate(userAnswers);
    } else {
        toast.error('Some answers are incorrect. Please try again.');
    }
};

    const joinMutation = useMutation({
        mutationFn: (answers) => api.put(`/users/${user._id}/${cohortId}`, { data: answers }),
        onSuccess: () => {
            toast.success("Great! You have successfully joined the cohort.");
            
            // Update global user context so the rest of the app knows we joined
            setUser((prev) => ({
                ...prev,
                cohorts: [...prev.cohorts, cohort]
            }));

            // Magic trick: Tell React Query to refetch this specific cohort.
            // This automatically populates the new MemberCard list without us faking the state!
            queryClient.invalidateQueries({ queryKey: ['cohort', cohortId] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to join cohort.");
        }
    });

    

    if (isLoading) return <p className="text-center mt-10">Loading cohort details...</p>;
    if (!cohort) return <p className="text-center mt-10">Cohort not found.</p>;

    // Clean boolean to check if the current user is already in this cohort
    const hasJoined = user.cohorts.some(c => c?._id?.toString() === cohort?._id?.toString());

    return (
        <>
            <h1>Cohort: <span className="cohort-name">{cohort.name}</span></h1>

            <section id="cohort-users" className="card mt-8">
                {hasJoined ? (
                    <>
                        <h2>Members</h2>
                        {cohort.users?.length > 0 ? (
                            <ul>
                                {cohort.users.map(member => (
                                    <MemberCard key={member._id} member={member} />
                                ))}
                            </ul>
                        ) : (
                            <p>Currently no cohorts members.</p>
                        )}
                    </>
                ) : (
                    <>
                        <h2>Answer Passcode to Join</h2>
                        <form onSubmit={handleSubmit} className="mt-4">
                            {cohort.passcode.map((pc, index) => (
                                <div key={index} className="form-row">
                                    <label htmlFor={`answer-${index}`}>{pc.question}</label>
                                    <input 
                                        type="text" 
                                        id={`answer-${index}`} 
                                        name="answer" 
                                        value={userAnswers[index] || ""} 
                                        onChange={(e) => handleChange(index, e.target.value)} 
                                        disabled={joinMutation.isPending} // Disable inputs while submitting!
                                    />
                                </div>
                            ))}
                            <div className="buttons">
                                <button type="submit" disabled={joinMutation.isPending}>
                                    {joinMutation.isPending ? "Joining..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </section>
        </>
    );
}

export default CohortDetail;