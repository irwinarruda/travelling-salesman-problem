import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const theme = extendTheme({
    styles: {
        global: (props: Dict<any>) => ({
            body: {
                color: mode('gray.800', 'whiteAlpha.900')(props),
                bgColor: mode('white', 'gray.700')(props),
            },
        }),
    },
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
});
