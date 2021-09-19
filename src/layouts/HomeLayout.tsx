import React from 'react';
import { Box, Button, Text, Flex } from '@chakra-ui/react';

import { Header } from '@components/Header';
import { RoutingMapProvider } from '@hooks/RoutingMap';

const HomeLayout: React.FC = () => {
    return (
        <RoutingMapProvider>
            <Header />
            <Box width="full" margin="0 auto">
                <Box id="map" width="full" height="calc(100vh - 83px)"></Box>
            </Box>
        </RoutingMapProvider>
    );
};

export default HomeLayout;
