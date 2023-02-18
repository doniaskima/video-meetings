import React from 'react';
import Header from "./layout/Header";
import Footer from "./layout/Footer";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col w-full min-h-screen text-base lg:text-lg antialiased text-gray-900 bg-white">
            <Header />
            <main className="flew-1 flex flex-col justify-center items-center w-full max-w-screen-xl mx-auto px-2">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout