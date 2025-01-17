import React from 'react'

function Loader() {
    return (
        <div className="max-w-7xl mx-auto flex items-center justify-center h-screen text-6xl">
            <l-ripples
                size="75"
                speed="2"
                color="#EF476F"
            ></l-ripples>
        </div>
    )
}

export default Loader
