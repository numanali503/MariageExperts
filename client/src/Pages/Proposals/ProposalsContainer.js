import React from 'react'
import ProposalsHero from './ProposalsHero'
import Proposals from './Proposals'

function ProposalsContainer() {
    return (
        // space-y-4 removed from here was disturbing the modal bg
        <div className="w-full ">
            <ProposalsHero/>
            <Proposals/>
        </div>
    )
}

export default ProposalsContainer