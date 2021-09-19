import React from 'react';
import {
    Box,
    Flex,
    Text,
    VStack,
    IconButton,
    Icon,
    Button,
    ButtonGroup,
    Heading,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    useToast,
} from '@chakra-ui/react';
import { FiSearch, FiCopy, FiDownload } from 'react-icons/fi';

import { useRoutingMap } from '@hooks/RoutingMap';

export const Header = (): JSX.Element => {
    const toast = useToast();
    const {
        routingData,
        findMatrixButonDisabled,
        handleGetBestRoute,
        handleDownloadData,
    } = useRoutingMap();

    const handleCopyBestPathClick = () => {
        navigator.clipboard.writeText(`[${routingData?.bestRoute.toString()}]`);
        toast({
            title: 'Copiado para a Área de Transferência',
            description: `[${routingData?.bestRoute.toString()}]`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    };
    const handleCopyBestValueClick = () => {
        navigator.clipboard.writeText(`${routingData?.bestRouteValue}`);
        toast({
            title: 'Copiado para a Área de Transferência',
            description: `${routingData?.bestRouteValue}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    };
    const handleDownloadODMatrix = () => {
        handleDownloadData('csv');
    };

    return (
        <Box width="full" bgColor="gray.500">
            <VStack
                alignItems="center"
                spacing="20px"
                width="container.xl"
                margin="0 auto"
                padding="20px"
            >
                <Heading as="h1" textAlign="center" userSelect="none">
                    Problema do Caixeiro-Viajante
                </Heading>
                <ButtonGroup>
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        color="white"
                        fontSize="lg"
                        onClick={handleGetBestRoute}
                        disabled={findMatrixButonDisabled}
                    >
                        Encontrar Distâncias
                    </Button>
                    <Popover>
                        <PopoverTrigger>
                            <IconButton
                                disabled={
                                    findMatrixButonDisabled || !routingData
                                }
                                aria-label="Visualizar Estatísticas"
                                icon={<Icon as={FiSearch} />}
                                bg="gray.600"
                                _hover={{
                                    bg: 'gray.600',
                                    opacity: '80%',
                                }}
                                _active={{
                                    bg: 'gray.600',
                                    opacity: '80%',
                                }}
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Estatísticas</PopoverHeader>
                            <PopoverBody>
                                <Text as="h3">Melhor Caminho</Text>
                                <Flex
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Text as="p" userSelect="none">
                                        [{routingData?.bestRoute.toString()}]
                                    </Text>
                                    <IconButton
                                        aria-label="Copy Button"
                                        icon={<Icon as={FiCopy} />}
                                        size="sm"
                                        onClick={handleCopyBestPathClick}
                                    />
                                </Flex>
                                <Text as="h3" marginTop="2">
                                    Custo(metros)
                                </Text>
                                <Flex
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Text as="p" userSelect="none">
                                        {routingData?.bestRouteValue}m
                                    </Text>
                                    <IconButton
                                        aria-label="Copy Button"
                                        icon={<Icon as={FiCopy} />}
                                        size="sm"
                                        onClick={handleCopyBestValueClick}
                                    />
                                </Flex>
                                <Button
                                    size="sm"
                                    onClick={handleDownloadODMatrix}
                                    leftIcon={<Icon as={FiDownload} />}
                                    display="block"
                                    margin="14px auto 0px 0px"
                                >
                                    Matriz OD CSV
                                </Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </ButtonGroup>
            </VStack>
        </Box>
    );
};
