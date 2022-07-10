import { extendTheme } from '@chakra-ui/react';

import PlayingCard from './PlayingCard';
import config from './config';

const theme = extendTheme({
  config,
  styles: {
    global: {
      html: {
        height: '100vh',
      },
    },
  },
  components: {
    PlayingCard,
  },
});

export default theme;
