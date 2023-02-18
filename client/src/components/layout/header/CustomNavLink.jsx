import React from 'react';
import { Link } from 'react-router-dom';

const CustomNavLink = ({ children, to, ...props }) => (
    <Link
        {...props}
        to={to}
        className="cursor-pointer no-underline text-black font-medium block w-full sm:w-auto text-center p-2"
    >
        {children}
    </Link>
);

export default CustomNavLink;
