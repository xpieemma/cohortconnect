import { useState } from "react"

export const useForm = (formType = 'organization', initialValue = 'default') => {

    let initialFormValue = {}
    let initialCollaboratorsValue = []

    if(formType === 'organization') {
        initialFormValue = {
            name:        initialValue==='default' ? '' : initialValue['name'],
            // description: initialValue==='default' ? '' : initialValue['description'],
        }
       
    }
    else if(formType === 'cohort') {
        console.log('initialvalue',initialValue);
        
        initialFormValue = {
            name:       initialValue==='default' ? '' : initialValue['name'],
            organization: initialValue==='default' ? '' : initialValue['organization'],
            passcode: initialValue==='default' ? [] : initialValue['passcode'],
            // status:      initialValue==='default' ? 'To Do' : initialValue['status']
        }
    }

    const [modal, setModal] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(initialFormValue)
    const [collaborators, setCollaborators] = useState(initialCollaboratorsValue)
    
    // clear or reset controlled form fields, by updating state variables
    const resetForm = (newData = false) => {
        if(newData) {
            // if(formType === 'project') {
            //     setCollaborators(newData['collaborators'].map(
            //         callaborator => callaborator._id
            //     ))
            // }
            setForm(newData)
            setModal(false)
        }
        else {
            // if(formType === 'project') {
            //     setCollaborators(initialCollaboratorsValue)
            // }
            setForm(initialFormValue)
            setModal(false)
        }
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