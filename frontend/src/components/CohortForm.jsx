import { useState} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../clients/api";
import { Modal } from "./ui/Modal"; // Import the Headless UI Modal we created
import toast from "react-hot-toast";

// Look! We removed `setCohorts` from the props!
function CohortForm({ organizationId, cohort, btnText = '+', headingText = 'Cohort' }) {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    
    // Standard React state is cleaner than a massive custom hook
    // 1. Initialize with empty defaults
    const [form, setForm] = useState({ 
        name: '', 
        organization: organizationId, 
        passcode: [{ question: '', answer: '' }] 
    });
const handleOpenModal = () => {
        if (cohort) {
            // If we are editing, populate the form NOW
            setForm({
                ...cohort,
                passcode: cohort.passcode?.length > 0 
                    ? cohort.passcode 
                    : [{ question: '', answer: '' }]
            });
        } else {
            // If we are adding new, reset to blank NOW
            setForm({ 
                name: '', 
                organization: organizationId, 
                passcode: [{ question: '', answer: '' }] 
            });
        }
        setIsOpen(true); // Finally, open the modal
    };
   
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasscodeChange = (field, value) => {
        const updatedPasscode = [{ ...form.passcode[0], [field]: value }];
        setForm({ ...form, passcode: updatedPasscode });
    };

    // --- React Query Mutation ---
    const saveMutation = useMutation({
        mutationFn: (formData) => {
            if (cohort) {
                return api.put(`/cohorts/${cohort._id}`, formData);
            }
            return api.post(`/organizations/${organizationId}/cohorts`, formData);
        },
        onSuccess: () => {
            toast.success(`Cohort ${cohort ? 'updated' : 'created'} successfully!`);
            queryClient.invalidateQueries({ queryKey: ['cohorts'] }); // Magically updates the UI!
            setIsOpen(false); // Close modal
            if (!cohort) setForm({ name: '', organization: organizationId, passcode: [{ question: '', answer: '' }] });
        },
        onError: (err) => toast.error(err.message || "Failed to save cohort")
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(form);
    };

    return (
        <>

        <button onClick={handleOpenModal}>{btnText}</button>
            <button onClick={() => setIsOpen(true)}>{btnText}</button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={headingText}>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-row mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name:</label>
                        <input
                            className="w-full"
                            value={form.name}
                            onChange={handleChange}
                            id="name"
                            name="name"
                            type="text"
                            required
                        />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h4 className="text-sm font-bold mb-2">Primary Passcode</h4>
                        <div className="form-row mb-2">
                            <label className="block text-sm font-medium mb-1">Question:</label>
                            <input
                                className="w-full"
                                value={form.passcode[0]?.question || ''}
                                onChange={(e) => handlePasscodeChange('question', e.target.value)}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-row mb-4">
                            <label className="block text-sm font-medium mb-1">Answer:</label>
                            <input
                                className="w-full"
                                value={form.passcode[0]?.answer || ''}
                                onChange={(e) => handlePasscodeChange('answer', e.target.value)}
                                type="text"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6">
                        <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-300 text-black">
                            Cancel
                        </button>
                        <button type="submit" disabled={saveMutation.isPending}>
                            {saveMutation.isPending ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default CohortForm;