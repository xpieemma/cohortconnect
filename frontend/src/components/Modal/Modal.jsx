import { useState, useEffect } from 'react'
import './Modal.css'

function Modal({ btnOpen = 'Open', btnClose = 'Close' }) {
    
    const [ modal, setModal ] = useState(false)

    useEffect(() => {
        if(modal) {
            document.body.classList.add('active-modal')
        }
        else {
            document.body.classList.remove('active-modal')
        }

        return () => document.body.classList.remove('active-modal')
    }, [modal])

    const toggleModal = () => {
        setModal(!modal)
    }

    return (
        <>
            <button onClick={toggleModal}>{btnOpen}</button>

            {
                modal && 
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">
                        <button onClick={toggleModal}>{btnClose}</button>
                        <h2>Hello</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas quos suscipit obcaecati est provident dolores eos, dicta numquam praesentium aut iure dignissimos ratione atque aperiam magni mollitia explicabo repellendus! Commodi mollitia vel cumque atque natus non illo saepe eveniet dignissimos veniam esse exercitationem porro corrupti ex vitae deserunt, incidunt fugit.</p>
                    </div>
                </div>
            }
        </>
    )
}

export default Modal