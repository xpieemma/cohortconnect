import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../clients/api";
import toast from "react-hot-toast";

// Removed setCohorts from props!
function Cohort({ cohort, isAdmin = false, hasJoined = false }) {
    const queryClient = useQueryClient();
    const [passcode, setPasscode] = useState({ question: '', answer: '' });

    // --- Deletion Mutation ---
    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/cohorts/${cohort._id}`),
        onSuccess: () => {
            toast.success("Cohort deleted!");
            queryClient.invalidateQueries({ queryKey: ['cohorts'] }); // Auto-removes it from the list
        },
        onError: (err) => toast.error(err.message || "Failed to delete cohort")
    });

    // --- Add Passcode Mutation ---
    const addPasscodeMutation = useMutation({
        mutationFn: (newPasscode) => api.put(`/cohorts/${cohort._id}`, { 
            passcode: [...cohort.passcode, newPasscode] 
        }),
        onSuccess: () => {
            toast.success("Passcode added!");
            setPasscode({ question: '', answer: '' });
            queryClient.invalidateQueries({ queryKey: ['cohorts'] }); // Auto-updates the UI
        },
        onError: (err) => toast.error(err.message || "Failed to add passcode")
    });

    const handleAddPasscode = (e) => {
        e.preventDefault();
        addPasscodeMutation.mutate(passcode);
    };

    return (
        <li className="card">
            <h3><Link to={`/cohort/${cohort._id}`}>{cohort.organization?.name}: {cohort.name}</Link></h3>
            
            <div className="details">
                {cohort.users && <p><span className="label">Members:</span> {cohort.users.length}</p>}
            </div>
            
            <div className="buttons">
                <Link to={`/cohort/${cohort._id}`}>
                    <button>{(isAdmin || hasJoined) ? 'View' : 'Join'}</button>
                </Link>
                
                {isAdmin && (
                    <button 
                        onClick={() => deleteMutation.mutate()} 
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                )}
            </div>

            {isAdmin && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-bold text-sm mb-2">Passcodes ({cohort.passcode.length})</h4>
                    {cohort.passcode.map((pc, index) => (
                        <p key={index} className="text-sm">
                            <span className="label">Q:</span> {pc.question} | <span className="label">A:</span> {pc.answer}
                        </p>
                    ))}
                    
                    <form onSubmit={handleAddPasscode} className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        <div className="form-row mb-2">
                            <label htmlFor="question" className="text-sm">New Question: </label>
                            <input 
                                type="text" id="question" name="question" 
                                value={passcode.question} 
                                onChange={(e) => setPasscode({ ...passcode, question: e.target.value })} 
                                required
                            />
                        </div>
                        <div className="form-row mb-2">
                            <label htmlFor="answer" className="text-sm">New Answer: </label>
                            <input 
                                type="text" id="answer" name="answer" 
                                value={passcode.answer} 
                                onChange={(e) => setPasscode({ ...passcode, answer: e.target.value })} 
                                required
                            />
                        </div>
                        <button type="submit" disabled={addPasscodeMutation.isPending}>
                            {addPasscodeMutation.isPending ? 'Adding...' : 'Add Passcode'}
                        </button>
                    </form>
                </div>
            )}
        </li>
    );
}

export default Cohort;