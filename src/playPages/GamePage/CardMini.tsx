import {
  Box,
  HStack,
  ResponsiveValue,
  Square,
  SquareProps,
  Text,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React from 'react';

import { CardSuitIcons } from '../../constants';
import { Card } from '../../lib/api/_game/Card';

interface CardMiniProps extends SquareProps {
  card: Pick<Card, 'valueLabel' | 'value' | 'suit'>;
  size?: ResponsiveValue<'sm' | 'md' | 'lg' | 'xl'>;
}

const CardMini: React.FC<CardMiniProps> = ({ card, size, ...props }) => {
  const { suit, value, valueLabel } = card;
  const SuitIcon = CardSuitIcons[suit];

  const styles = useMultiStyleConfig('CardMini', {
    variant: suit,
    size,
  });

  return (
    <Square __css={styles.card} {...props}>
      <HStack
        __css={styles.inner}
        flexDir="row"
        align="center"
        justify="center"
      >
        <Text sx={styles.value}>{valueLabel?.short || value}</Text>
        <Box __css={styles.suit} w="fit-content">
          {SuitIcon && <SuitIcon weight="fill" />}
        </Box>
      </HStack>
    </Square>
  );
};

export default CardMini;
