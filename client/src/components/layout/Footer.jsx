import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="mt-auto py-4 px-2">
            <div className="flex justify-center space-x-4 py-2">
                <Link
                    className="text-sm uppercase font-medium tracking-wide text-gray-600 focus:outline-none focus:text-gray-400"
                    to="/how-it-works"
                >
                How it Works
                </Link>
            </div>
        </footer>
    )
}

export default Footer