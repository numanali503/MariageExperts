import React from 'react'
import RegisterHero from './Hero'
import Track from './Form'

function Container() {
    return (
        <div className="w-full space-y-4">
            <RegisterHero></RegisterHero>
            <Track></Track>
        </div>
    )
}

export default Container