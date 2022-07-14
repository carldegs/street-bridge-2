import { extendTheme } from '@chakra-ui/react';

import { CardMini, PlayingCard } from './PlayingCard';
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
    CardMini,
  },
});

export default theme;
