import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const HomeLayout = dynamic(() => import('../layouts/HomeLayout'), {
    ssr: false,
});

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Problema do Caixeiro-Viajante</title>
            </Head>
            <HomeLayout />
        </>
    );
};

export default Home;
