import {
  Flex,
  Box,
  Text,
  Button,
  Spinner,
  Spacer,
  HStack,
  Stack,
  Circle,
  Container,
  FlexProps,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import PhosphorIcon from '../../../components/PhosphorIcon';
import {
  BidSuit,
  CardSuit,
  CardSuitIcons,
  CARD_COLORS,
  TEAM_COLORS,
} from '../../../constants';
import { auth } from '../../../lib/api/firebase';
import { Game } from '../../../lib/api/game/Game';
import { Bid } from '../../../types';

export const BidChat: React.FC<
  {
    game?: Game;
    onClick?: (bid: Bid | 'pass') => void;
  } & Omit<FlexProps, 'onClick'>
> = ({ game, onClick, ...props }) => {
  const [user] = useAuthState(auth);
  const minBid = game.getMinimumBid();
  const [bidValue, setBidValue] = useState<number | undefined>();
  const [bidSuit, setBidSuit] = useState<BidSuit | undefined>();

  const currPlayer = game.getPlayerBidData();

  if (!game || !user) {
    return null;
  }

  return (
    <>
      <Flex
        w="full"
        mb={2}
        flexDir="column"
        pos="relative"
        h="full"
        overflow="auto"
        {...props}
      >
        {/* <Box
          pos="absolute"
          zIndex={-1}
          h="calc(100%)"
          w="1px"
          bg="blackAlpha.400"
          left="calc(50% - .5px)"
          mt={10}
        /> */}
        <Flex w="full" align="center" justify="center" mb={8}>
          <Stack
            textAlign="right"
            spacing={-2}
            color={`${TEAM_COLORS[0]}.400`}
            flexGrow={1}
            flexBasis={0}
          >
            <Text fontSize="2xl" fontWeight="bold">
              {game.teamNames[0]}
            </Text>
            <Text>{game.tricksNeeded[0]} TO WIN</Text>
          </Stack>
          <Circle size={6} mx={4} bg="blackAlpha.400" mt={1} />
          <Stack
            spacing={-2}
            color={`${TEAM_COLORS[1]}.400`}
            flexGrow={1}
            flexBasis={0}
          >
            <Text fontSize="2xl" fontWeight="bold">
              {game.teamNames[1]}
            </Text>
            <Text>{game.tricksNeeded[1]} TO WIN</Text>
          </Stack>
        </Flex>

        {game.bidHistory.map(({ bid, playerId }) => {
          const { displayName, role, teamColor } =
            game.getPlayerBidData(playerId);

          return (
            <Flex
              w="full"
              align="center"
              justify="center"
              flexDirection={!role ? 'row' : 'row-reverse'}
              mb={3}
              key={`bid-history-${bid?.suit}-${
                bid?.value || 'pass'
              }-${playerId}`}
            >
              <Text
                flexGrow={1}
                flexBasis={0}
                textAlign={!role ? 'right' : 'left'}
                fontSize="lg"
                color={bid?.value ? `${teamColor}.400` : 'gray.500'}
              >
                {displayName}
              </Text>
              <Circle
                size={8}
                mx={3}
                mt={1}
                px={8}
                color={`blackAlpha.700`}
                fontSize="md"
                fontWeight="bold"
                bg={bid?.value ? `${teamColor}.500` : 'gray.500'}
              >
                <Text mt={-0.5}>{bid?.value ? bid.value + 6 : 'PASS'}</Text>
                {!bid?.suit ? null : bid.suit === BidSuit.noTrump ? (
                  <Text mt={-0.5}>NT</Text>
                ) : (
                  <PhosphorIcon
                    icon={CardSuitIcons[bid.suit]}
                    fontWeight="fill"
                    mt={-0.5}
                  />
                )}
              </Circle>
              <Box flexGrow={1} flexBasis={0} />
            </Flex>
          );
        })}
      </Flex>

      {onClick &&
        (game.currPlayerId === user.uid ? (
          <Container
            maxW="container.sm"
            bg="blackAlpha.400"
            borderRadius="lg"
            pt={2}
            pb={4}
            mb={20}
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
              textAlign="center"
            >
              SELECT BID
            </Text>
            <Text
              textAlign="center"
              mt={4}
              mb={-3}
              color="whiteAlpha.500"
              fontSize="sm"
            >
              Select how many tricks your team can win...
            </Text>
            <Flex
              align="center"
              justify="space-between"
              pt={4}
              mx={{ base: 0, lg: 4 }}
            >
              {[...new Array(8 - minBid.value)]
                .map((_, i) => minBid.value + i)
                .map((value) => (
                  <Button
                    key={`bid-value-${value}`}
                    colorScheme={
                      value === bidValue
                        ? game.getPlayerPublicData().teamColor
                        : 'gray'
                    }
                    onClick={() => {
                      setBidValue(value);
                      if (value === minBid.value && bidSuit <= minBid.suit) {
                        setBidSuit(undefined);
                      }
                    }}
                    w="full"
                    mx={{ base: 1, md: 1.5 }}
                  >
                    {value + 6}
                  </Button>
                ))}
            </Flex>

            <Text
              textAlign="center"
              mt={4}
              mb={-3}
              color="whiteAlpha.500"
              fontSize="sm"
            >
              ...given the following trump suit
            </Text>
            <Flex
              align="center"
              justify="space-between"
              pt={4}
              mx={{ base: 0, lg: 4 }}
            >
              {[...new Array(5)]
                .map((_, i) => BidSuit.club + i)
                .map((suit) => (
                  <Button
                    key={`bid-suit-${suit}`}
                    colorScheme={
                      suit === bidSuit ? CARD_COLORS[suit] || 'pink' : 'gray'
                    }
                    onClick={() => {
                      setBidSuit(suit);
                    }}
                    w="full"
                    mx={1.5}
                    isDisabled={bidValue === minBid.value && suit < minBid.suit}
                  >
                    {suit === BidSuit.noTrump ? (
                      'NT'
                    ) : (
                      <PhosphorIcon
                        icon={CardSuitIcons[suit as CardSuit]}
                        fontWeight={suit === bidSuit ? 'duotone' : 'fill'}
                      />
                    )}
                  </Button>
                ))}
            </Flex>

            <Flex
              align="center"
              justify="space-between"
              pt={4}
              mx={{ base: 0, lg: 4 }}
              mt={3}
            >
              <Button
                colorScheme="blue"
                isDisabled={!bidValue || !bidSuit}
                onClick={(e) => {
                  e.preventDefault();
                  onClick({
                    suit: bidSuit,
                    value: bidValue,
                  });
                  setBidSuit(undefined);
                  setBidValue(undefined);
                }}
              >
                BID
              </Button>
              {!!(bidValue && bidSuit) && (
                <Text
                  ml={2}
                  maxW="150px"
                  fontSize="sm"
                  color="blue.200"
                  fontWeight="semibold"
                >
                  The other team only needs{' '}
                  {game.computeTricksNeeded(bidValue).neededByLoser} point
                  {game.computeTricksNeeded(bidValue).neededByLoser > 1
                    ? 's'
                    : ''}{' '}
                  to win.
                </Text>
              )}
              <Spacer />
              <Button
                colorScheme="red"
                onClick={(e) => {
                  e.preventDefault();
                  onClick('pass');
                  setBidSuit(undefined);
                  setBidValue(undefined);
                }}
                isDisabled={!game.bidHistory?.length}
                title={!game.bidHistory?.length && 'First player cannot pass!'}
              >
                PASS
              </Button>
            </Flex>
          </Container>
        ) : (
          <HStack spacing={8} w="full">
            <Flex
              w="full"
              align="center"
              justify="center"
              flexDirection={!currPlayer.role ? 'row' : 'row-reverse'}
            >
              <Text
                flexGrow={1}
                flexBasis={0}
                textAlign={!currPlayer.role ? 'right' : 'left'}
                fontSize="lg"
                color={`${currPlayer.teamColor}.400`}
              >
                {currPlayer.displayName}
              </Text>
              <Circle
                size={10}
                mx={7}
                bg={`${currPlayer.teamColor}.400`}
                mt={1}
              >
                <Spinner color={`${currPlayer.teamColor}.800`} />
              </Circle>
              <Box flexGrow={1} flexBasis={0} />
            </Flex>
          </HStack>
        ))}
    </>
  );
};
