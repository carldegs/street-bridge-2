import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import React from 'react';

import { PlayProvider } from '../hooks/PlayContext';
import theme from '../theme';
import Fonts from '../theme/Fonts';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <PlayProvider>
      <ChakraProvider theme={theme}>
        <Fonts />
        <Component {...pageProps} />
      </ChakraProvider>
    </PlayProvider>
  );
};

export default MyApp;
