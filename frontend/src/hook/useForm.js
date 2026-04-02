import { useState } from "react"

export const useForm = (formType = 'project') => {

    const itemName = formType==='project' ? 'name' : 'title'
    const initialFormValue = { [itemName]: '', description: '' }
    const initialCollaboratorsValue = []

    const [modal, setModal] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(initialFormValue)
    const [collaborators, setCollaborators] = useState(initialCollaboratorsValue)
    
    // clear controlled form fields, by updating state variables
    const resetForm = () => {
        setForm(initialFormValue)
        setCollaborators(initialCollaboratorsValue)
        setModal(false)
    }

    const toggleModal = () => {
        setModal(!modal)
    }
    
    // update controlled form fields, by updating state variables
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    
    // update controlled form checkboxes, by updating state variables
    const handleCheckboxChange = (e) => {
        const userId = e.target.value

        if (e.target.checked) {
            // Add user
            setCollaborators(prev => [...prev, userId]);
        } else {
            // Remove user
            setCollaborators(prev => prev.filter(id => id !== userId))
        }
    }

    return { modal, toggleModal, showForm, setShowForm, form, setForm, collaborators, setCollaborators, resetForm, handleChange, handleCheckboxChange }
}