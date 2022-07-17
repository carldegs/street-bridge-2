import {
  Box,
  Flex,
  FlexProps,
  ResponsiveValue,
  Text,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React from 'react';

import { CardSuitIcons } from '../../../constants';
import { Card } from '../../../lib/api/_game/Card';

interface PlayingCardProps {
  card: Pick<Card, 'valueLabel' | 'value' | 'suit'>;
  size?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  disabled?: boolean;
}

const PlayingCard: React.FC<PlayingCardProps & FlexProps> = ({
  card,
  disabled,
  size = 'md',
  ...props
}) => {
  const { suit, value, valueLabel } = card || {};
  const SuitIcon = CardSuitIcons[suit];

  const styles = useMultiStyleConfig('PlayingCard', {
    size,
    variant: suit,
  });

  return (
    <Flex __css={styles.card} {...{ disabled }} {...props}>
      <Flex __css={styles.inner}>
        <Text sx={styles.value}>{valueLabel?.short || value}</Text>
        <Box __css={styles.suit}>{SuitIcon && <SuitIcon weight="fill" />}</Box>
      </Flex>
    </Flex>
  );
};

export default PlayingCard;
