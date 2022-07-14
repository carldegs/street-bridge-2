import { ComponentMultiStyleConfig } from '@chakra-ui/react';

import { CardSuit } from '../constants';

const getCardWidthHeight = (mult: number) => ({
  w: `${mult * 2.5}px`,
  h: `${mult * 3.5}px`,
});

const getVariants = (base: string) => ({
  card: {
    bg: `${base}.100`,
  },
  inner: {
    bg: `${base}.400`,
  },
  value: {
    color: `${base}.800`,
  },
  suit: {
    color: `${base}.800`,
  },
});

const DEFAULT_BOX_SHADOW =
  'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;';
const HOVER_BOX_SHADOW =
  'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;';

export const PlayingCard: ComponentMultiStyleConfig = {
  parts: ['card', 'inner', 'value', 'suit'],
  baseStyle: {
    card: {
      ...getCardWidthHeight(35),
      userSelect: 'none',
      bg: 'gray.100',
      borderRadius: 'xl',
      boxShadow: DEFAULT_BOX_SHADOW,
      zIndex: 0,
      _hover: {
        boxShadow: HOVER_BOX_SHADOW,
        transform: 'scale(1.07) !important',
        filter: `brightness(1) !important`,
        zIndex: 10,
      },
      _groupHover: {
        filter: 'brightness(0.8)',
        transform: 'scale(0.97)',
      },
      _disabled: {
        filter: 'brightness(0.5) !important',
        cursor: 'not-allowed',
      },
      cursor: 'pointer',
      transition: '0.125s cubic-bezier(.29,.91,.32,.96)',
      p: 1.5,
    },
    inner: {
      w: 'full',
      h: 'full',
      bg: 'gray.400',
      borderRadius: 'lg',
      overflow: 'hidden',
      flexDir: 'column',
      justifyContent: 'space-between',
    },
    value: {
      fontWeight: 'bold',
      fontSize: '3xl',
      color: 'gray.800',
      mt: -1,
      ml: 1.5,
    },
    suit: {
      color: 'gray.800',
      fontSize: '6.25rem',
      mt: -5,
      ml: 0,
    },
  },
  sizes: {
    md: {
      card: {
        ...getCardWidthHeight(41),
        p: 2,
      },
      value: {
        fontSize: '4xl',
        mt: 0,
        ml: 2,
      },
      suit: {
        fontSize: '9rem',
        mt: -5,
      },
    },
    lg: {
      card: {
        ...getCardWidthHeight(50),
        p: 2.5,
      },
      value: {
        fontSize: '4xl',
        mt: -2,
        ml: 2,
      },
      suit: {
        fontSize: '9rem',
        mt: -2,
      },
    },
    xl: {
      card: {
        ...getCardWidthHeight(55),
        p: 3,
      },
      value: {
        fontSize: '4xl',
        mt: -2,
        ml: 2,
      },
      suit: {
        fontSize: '10rem',
        mt: -3.5,
      },
    },
  },
  variants: {
    [CardSuit.club]: getVariants('teal'),
    [CardSuit.diamond]: getVariants('orange'),
    [CardSuit.heart]: getVariants('red'),
    [CardSuit.spade]: getVariants('blue'),
  },
};

export const CardMini: ComponentMultiStyleConfig = {
  baseStyle: {
    card: {
      userSelect: 'none',
      bg: 'gray.100',
      borderRadius: 'lg',
      boxShadow: DEFAULT_BOX_SHADOW,
      transition: '0.125s cubic-bezier(.29,.91,.32,.96)',
      p: 1,
      w: '45px',
      h: '45px',
    },
    inner: {
      w: 'full',
      h: 'full',
      borderRadius: 'lg',
      flexDir: 'row',
      display: 'flex',
    },
    value: {
      fontWeight: 'bold',
      fontSize: 'lg',
      mt: -1,
      letterSpacing: 'tight',
    },
    suit: {
      fontWeight: 'bold',
      fontSize: 'lg',
      ml: '-1px',
    },
  },
  sizes: {
    md: {
      card: {
        w: '58px',
        h: '58px',
        p: 1.5,
        borderRadius: 'xl',
      },
      value: {
        fontSize: '2xl',
      },
      suit: {
        fontSize: '2xl',
        ml: '-2px',
      },
    },
  },
  parts: PlayingCard.parts,
  variants: PlayingCard.variants,
};
