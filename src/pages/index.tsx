import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const HomeLayout = dynamic(() => import('../layouts/HomeLayout'), {
    ssr: false,
});

const Home: NextPage = () => {
    return <HomeLayout />;
};

export default Home;
