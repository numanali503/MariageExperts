import React from 'react'
import RegisterHero from './RegisterHero'
import RegisterForm from './RegisterForm'

function Container() {
    return (
        <div className="w-full space-y-4">
            <RegisterHero></RegisterHero>
            <RegisterForm></RegisterForm>
        </div>
    )
}

export default Container