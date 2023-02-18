import React from 'react';
import CustomNavLink from './header/CustomNavLink';

const Header = () => {

    return (
        <header className="py-4 px-2 sm:px-6">
            <nav className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
                <CustomNavLink to="/">Videoma</CustomNavLink>
            </nav>
        </header>
    )
}

export default Header