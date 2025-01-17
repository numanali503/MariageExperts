import React from 'react'
import ContactHero from './ContactHero'
import ContactForm from './ContactForm'

function ContactContainer() {
    return (
        <div className="w-full space-y-4">
            <ContactHero></ContactHero>
            <ContactForm></ContactForm>
        </div>
    )
}

export default ContactContainer