import {
  Center,
  Text,
  useToast,
  Stack,
  IconButton,
  Icon,
  HStack,
  Flex,
  Box,
  SimpleGrid,
  useClipboard,
  Container,
  useDisclosure,
  Spinner,
  Heading,
} from '@chakra-ui/react';
import {
  ArrowFatDown,
  ArrowFatUp,
  Faders,
  HandPalm,
  SortAscending,
  SortDescending,
  Strategy,
  UsersThree,
} from 'phosphor-react';
import React, { useEffect, useMemo } from 'react';

import DrawerMenu from '../../components/DrawerMenu';
import { LobbyCodeCard } from '../../components/LobbyCodeCard';
import { AUTO_LOOP, Phase } from '../../constants';
import useCustomColorMode from '../../hooks/useCustomColorMode';
import { BidChat } from './BidChat';
import BidsModal from './BidsModal';
import EndGameAlert from './EndGameAlert';
import { GamePageNavBar } from './GamePageNavBar';
import { HandSelectionMenu } from './HandSelectionMenu';
import PlayerListModal from './PlayerListModal';
import PlayingCardHand from './PlayingCardHand';
import useGamePage from './useGamePage';
import useHand from './useHand';

const GamePage: React.FC = () => {
  const toast = useToast();
  const { game, isLoading, gameError, user, fetch, handleEndGame, handleBid } =
    useGamePage();
  const colorMode = useCustomColorMode();

  const codeClipboard = useClipboard(game?.lobbyId);
  const playerListModalDisc = useDisclosure();
  const endGameAlertDisc = useDisclosure();
  const bidsModalDisc = useDisclosure();

  const {
    isSpectator,
    playerCards,
    showHand,
    FilterIcon,
    sort,
    handleSort,
    filter,
    handleFilter,
    handleShowHand,
    selectedUser,
    setSelectedUser,
  } = useHand(game, user);

  const settingsMenuList = useMemo(
    () => [
      {
        text: 'View Players',
        icon: <UsersThree size="100%" weight="fill" />,
        onClick: playerListModalDisc.onOpen,
      },
      {
        text: 'View Bids',
        icon: <Strategy size="100%" weight="fill" />,
        hidden: game?.phase !== Phase.battle,
        onClick: bidsModalDisc.onOpen,
      },
      {
        text: colorMode.tooltip,
        icon: <colorMode.Icon weight="fill" />,
        onClick: colorMode.toggle,
      },
      {
        text: 'End Game',
        icon: <HandPalm size="100%" weight="fill" />,
        onClick: endGameAlertDisc.onOpen,
        hidden: game?.host?.uid !== user?.uid,
      },
    ],
    [
      bidsModalDisc.onOpen,
      colorMode,
      endGameAlertDisc.onOpen,
      game?.host?.uid,
      game?.phase,
      playerListModalDisc.onOpen,
      user?.uid,
    ]
  );

  useEffect(() => {
    if (!isLoading && gameError) {
      toast({
        status: 'error',
        title: 'Cannot fetch lobby',
        description: gameError.message,
        isClosable: true,
      });
    }
  }, [gameError, isLoading, toast]);

  useEffect(() => {
    if (!isLoading && game?.phase === Phase.cancelled) {
      fetch(user);
    }
  }, [fetch, game?.phase, isLoading, user]);

  useEffect(() => {
    if ((game && !game.isMember(user.uid)) || (!game && !isLoading)) {
      fetch(user);

      toast({
        status: 'error',
        title: 'Forbidden Access',
        description:
          'You have no access to the room or the room does not exist.',
        isClosable: true,
      });
    }
  }, [fetch, game, isLoading, toast, user]);

  if (!game && isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <PlayerListModal
        members={game.membersData}
        teamNames={game.teamNames}
        {...playerListModalDisc}
      />
      <EndGameAlert
        onClick={async () => {
          try {
            await handleEndGame();
            fetch(user);
          } catch (err) {
            toast({
              status: 'error',
              title: 'Cannot End Game',
              description: err?.message,
            });
          }
        }}
        {...endGameAlertDisc}
      />
      <BidsModal game={game} {...bidsModalDisc} />
      <Box
        w="full"
        h="100vh"
        flexDir="column"
        pos="relative"
        bg={!colorMode.isDark && 'gray.100'}
        overflow="auto"
      >
        <GamePageNavBar
          roleId={game.getMemberData(user.uid).role}
          teamName={game.getMemberRoleName(user.uid)}
          displayName={user.displayName}
          isCurrPlayer={user.uid === game.currPlayerId}
        />
        <Container mt={4} maxW="container.xl" centerContent>
          <SimpleGrid columns={3} w="full">
            <LobbyCodeCard onClick={codeClipboard.onCopy} code={game.lobbyId} />
            <Flex align="center" justify="center" textAlign="center">
              {game.phase === Phase.bidding && (
                <Heading fontSize="2xl">BID PHASE</Heading>
              )}
              {game.phase === Phase.battle && (
                <Heading fontSize="2xl">GAME PHASE</Heading>
              )}
            </Flex>
            <Box
              bg={`${game.getPlayerPublicData().teamColor}.200`}
              color={`${game.getPlayerPublicData().teamColor}.800`}
              px={4}
              py={3}
              borderRadius="lg"
              w="fit-content"
              minW={{ base: 'auto', md: '160px' }}
              ml="auto"
            >
              <Text
                textAlign="center"
                fontSize={{
                  base: 'xs',
                  md: 'sm',
                }}
                letterSpacing="widest"
                mb={-1}
              >
                {game.phase === Phase.bidding ? 'BIDDING' : 'PLAYING'}
              </Text>
              <Text
                fontSize={{
                  base: 'lg',
                  md: '2xl',
                }}
                fontWeight="bold"
                textAlign="center"
              >
                {game.getMemberName(game.currPlayerId)}
              </Text>
            </Box>
          </SimpleGrid>
          {game.phase === Phase.bidding && (
            <BidChat
              game={game}
              onClick={handleBid}
              maxH={game.currPlayerId === user.uid ? '30vh' : '50vh'}
            />
          )}
        </Container>
        <Stack w="full" pos="fixed" bottom={0}>
          <PlayingCardHand cards={playerCards} hide={!showHand} />
          <SimpleGrid
            columns={{ base: 2, md: 3 }}
            w="full"
            px={{ base: 4, md: 8, lg: 12, xl: 20 }}
            py={3}
            bg={colorMode.isDark ? 'gray.900' : 'gray.200'}
            zIndex={12}
          >
            <Box display={{ base: 'none', md: 'initial' }}>
              <DrawerMenu
                title="Options"
                options={settingsMenuList}
                buttonContent={
                  <Icon>
                    <Faders size="100%" weight="bold" />
                  </Icon>
                }
                menuButtonProps={{
                  as: IconButton,
                  variant: 'ghost',
                  size: 'lg',
                }}
              />
            </Box>
            <HStack
              spacing={{ base: 1, md: 4 }}
              justify={{ base: 'flex-start', md: 'center' }}
            >
              <Box display={{ base: 'initial', md: 'none' }}>
                <DrawerMenu
                  title="Options"
                  options={settingsMenuList}
                  buttonContent={
                    <Icon>
                      <Faders size="100%" weight="bold" />
                    </Icon>
                  }
                  menuButtonProps={{
                    as: IconButton,
                    variant: 'ghost',
                    size: 'lg',
                  }}
                />
              </Box>
              <IconButton
                aria-label="Sort Cards"
                variant={!sort ? 'ghost' : 'solid'}
                colorScheme={!sort ? 'gray' : 'teal'}
                onClick={handleSort}
                title="Sort Cards"
                size={{ base: 'md', md: 'lg' }}
              >
                <Icon>
                  {(sort === 'asc' || !sort) && (
                    <SortAscending size="100%" weight="bold" />
                  )}
                  {sort === 'desc' && (
                    <SortDescending size="100%" weight="bold" />
                  )}
                </Icon>
              </IconButton>
              <IconButton
                aria-label="Filter Cards"
                colorScheme={filter < 0 ? 'gray' : 'teal'}
                variant={filter < 0 ? 'ghost' : 'solid'}
                onClick={handleFilter}
                title="Filter Cards"
                size={{ base: 'md', md: 'lg' }}
              >
                <Icon>
                  <FilterIcon size="100%" weight="bold" />
                </Icon>
              </IconButton>
              <IconButton
                aria-label={showHand ? 'Hide Cards' : 'Show Cards'}
                colorScheme={showHand ? 'gray' : 'teal'}
                variant={showHand ? 'ghost' : 'solid'}
                onClick={handleShowHand}
                title={showHand ? 'Hide Cards' : 'Show Cards'}
                size={{ base: 'md', md: 'lg' }}
              >
                <Icon>
                  {showHand ? (
                    <ArrowFatDown size="100%" weight="bold" />
                  ) : (
                    <ArrowFatUp size="100%" weight="bold" />
                  )}
                </Icon>
              </IconButton>
            </HStack>
            <Flex justify="flex-end" flexGrow={1}>
              {isSpectator && (
                <HandSelectionMenu
                  selectedUser={
                    selectedUser === AUTO_LOOP
                      ? game.getMemberName(game.currPlayerId)
                      : game.getMemberName(selectedUser)
                  }
                  setSelectedUser={setSelectedUser}
                  players={game.players.sort().map((id) => ({
                    value: id,
                    label: game.getMemberName(id),
                  }))}
                  isAuto={selectedUser === AUTO_LOOP}
                />
              )}
            </Flex>
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};

export default GamePage;
