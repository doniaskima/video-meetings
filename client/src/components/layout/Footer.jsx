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
                <Link
                    className="text-sm uppercase font-medium tracking-wide text-gray-600 focus:outline-none focus:text-gray-400"
                    to="/about"
                >
                    About
                </Link>
            </div>
            <div className="flex items-baseline justify-center">
                <span>Created with</span>
                <span role="img" aria-label="heart-icon" className="inline-block mx-1">
                    ❤️
                </span>
                <span>by</span>
                <a
                    className="ml-1 text-blue-500 hover:text-blue-400 text-sm uppercase tracking-wide font-semibold focus:outline-none focus:text-blue-300"
                    href="https://github.com/doniaskima">
                    Donia Skima
                </a>
            </div>
        </footer>
    )
}

export default Footer