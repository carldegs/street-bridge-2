import {
  Box,
  Flex,
  ResponsiveValue,
  Text,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React from 'react';

import { CardSuitIcons } from '../../constants';
import { Card } from '../../lib/api/_game/Card';

interface PlayingCardProps {
  card: Pick<Card, 'valueLabel' | 'value' | 'suit'>;
  size?: ResponsiveValue<'sm' | 'md' | 'lg' | 'xl'>;
  disabled?: boolean;
}

const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  disabled,
  size = 'md',
}) => {
  const { suit, value, valueLabel } = card;
  const SuitIcon = CardSuitIcons[suit];

  const styles = useMultiStyleConfig('PlayingCard', {
    size,
    variant: suit,
  });

  return (
    <Flex __css={styles.card} {...{ disabled }}>
      <Flex __css={styles.inner}>
        <Text sx={styles.value}>{valueLabel?.short || value}</Text>
        <Box __css={styles.suit}>{SuitIcon && <SuitIcon weight="fill" />}</Box>
      </Flex>
    </Flex>
  );
};

export default PlayingCard;
