import React from 'react';
import Layout from "../components/Layout";

const Homepage = () => {
    return (
        <Layout>
            <div className="relative w-full flex flex-col justify-center items-center">
                <div>
                    <h1 className="font-mono text-4xl lg:text-5xl text-center font-semibold leading-tight">
                        Videoma
                    </h1>
                    <p className="text-gray">
                        Video Meetings App
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Homepage