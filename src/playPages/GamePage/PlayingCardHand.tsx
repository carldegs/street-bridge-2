import {
  useBreakpointValue,
  Wrap,
  WrapItem,
  WrapProps,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import { Card } from '../../lib/api/_game/Card';
import PlayingCard from './PlayingCard';

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
};

const PlayingCardHand: React.FC<
  { cards: Card[]; hide?: boolean } & WrapProps
> = ({ cards = [], hide, ...props }) => {
  const size = useBreakpointValue({
    base: 'sm',
    md: 'md',
    xl: 'lg',
  } as const);

  return (
    <Wrap
      spacingX={{ base: -4, md: -8, lg: -8 }}
      spacingY={{ base: -8, md: -10, lg: -16 }}
      // shouldWrapChildren
      role="group"
      // pt={2}
      mb={hide ? -4 : { base: 2, md: 4 }}
      // px={{ base: 4, lg: 8 }}
      mx="auto"
      w="fit-content"
      align="center"
      justify="center"
      maxH={hide ? 0 : '500px'}
      transform={`scale(${hide ? 0.8 : 1})`}
      transition="250ms cubic-bezier(.29,.91,.32,.96)"
      overflow="visible"
      {...props}
    >
      {cards?.map((card) => (
        <WrapItem
          as={motion.li}
          layout
          transition={spring as any}
          key={card.id}
        >
          <PlayingCard card={card} size={size} />
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default PlayingCardHand;
