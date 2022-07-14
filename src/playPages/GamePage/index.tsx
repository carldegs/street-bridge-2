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
  Container,
  useDisclosure,
  Spinner,
  Heading,
  Hide,
  Circle,
  Grid,
  Show,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ButtonGroup,
  Button,
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
import PhosphorIcon from '../../components/PhosphorIcon';
import {
  AUTO_LOOP,
  CardSuitIcons,
  CARD_COLORS,
  Phase,
  TEAM_COLORS,
} from '../../constants';
import useCustomColorMode from '../../hooks/useCustomColorMode';
import { BidChat } from './BidChat';
import BidsModal from './BidsModal';
import CardMini from './CardMini';
import EndGameAlert from './EndGameAlert';
import { GamePageNavBar } from './GamePageNavBar';
import { HandSelectionMenu } from './HandSelectionMenu';
import PlayerListModal from './PlayerListModal';
import PlayingCard from './PlayingCard';
import PlayingCardHand from './PlayingCardHand';
import TeamScore from './TeamScore';
import useGamePage from './useGamePage';
import useHand from './useHand';
import useScore from './useScore';

const GamePage: React.FC = () => {
  const toast = useToast();
  const {
    game,
    isLoading,
    gameError,
    user,
    fetch,
    handleEndGame,
    handleBid,
    handlePlayCard,
    isUpdating,
  } = useGamePage();
  const colorMode = useCustomColorMode();

  const playerListModalDisc = useDisclosure();
  const endGameAlertDisc = useDisclosure();
  const bidsModalDisc = useDisclosure();

  const { score, scoreModeLabel, leadingTeam, toggleMode, winningTeam } =
    useScore(game);
  const {
    isSpectator,
    playerCards,
    showHand,
    disableHand,
    disableSuits,
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
    if (!game) {
      return;
    }

    if (game.plays.length === 4) {
      const id = 'game-results';
      if (!toast.isActive(id)) {
        const lastRound = game.roundHistory[game.roundHistory.length - 1];
        toast({
          id,
          description: `${game.getMemberName(lastRound.playerId)} (${
            lastRound.teamName
          }) wins the trick!`,
          colorScheme: TEAM_COLORS[lastRound.team],
          position: 'top',
          size: 'lg',
          duration: 2500,
        });
      }
    }
  }, [game, toast]);

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

  const BidData = game.bid && (
    <TeamScore
      score={
        <HStack spacing={0}>
          <Text>{game.bid.bid.value + 6}</Text>
          <PhosphorIcon
            icon={CardSuitIcons[game.bid.bid.suit]}
            fontWeight="fill"
          />
        </HStack>
      }
      colorScheme={CARD_COLORS[game.bid.bid.suit]}
      direction="center"
      teamName="Bid"
    />
  );

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
        {isUpdating && <Heading>TEST</Heading>}
        <GamePageNavBar
          roleId={game.getMemberData(user.uid).role}
          teamName={game.getMemberRoleName(user.uid)}
          displayName={user.displayName}
          isCurrPlayer={user.uid === game.currPlayerId}
        />
        <Container mt={4} maxW="container.xl" centerContent>
          <SimpleGrid columns={{ base: 2, md: 3 }} w="full" spacing={2}>
            <LobbyCodeCard code={game.lobbyId} variant="flat" />
            <Hide below="md">
              <Flex align="center" justify="center" textAlign="center">
                {game.phase === Phase.bidding && (
                  <Heading fontSize="2xl">BID PHASE</Heading>
                )}
                {game.phase === Phase.battle && (
                  <Heading fontSize="2xl">GAME PHASE</Heading>
                )}
                {game.phase === Phase.postgame && (
                  <Heading
                    fontSize={{ base: '2xl', md: '3xl' }}
                    textTransform="uppercase"
                    letterSpacing="tight"
                  >{`${game.teamNames[winningTeam]} Wins!`}</Heading>
                )}
              </Flex>
            </Hide>
            <Flex
              flexDir={{ base: 'row', md: 'column' }}
              align="center"
              justify={{ base: 'space-between', md: 'center' }}
              bg={`${game.getPlayerPublicData().teamColor}.200`}
              color={`${game.getPlayerPublicData().teamColor}.800`}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 3 }}
              borderRadius="lg"
              w={{ base: 'full', md: 'fit-content' }}
              minW={{ base: 'auto', md: '160px' }}
              ml="auto"
            >
              <Text
                textAlign="center"
                fontSize={{
                  base: 'xs',
                  md: 'sm',
                }}
                letterSpacing={{ base: 'wide', md: 'widest' }}
                mb={{ md: -1 }}
                mr={{ base: 1.5, md: 0 }}
              >
                {game.phase === Phase.bidding ? 'BIDDING' : 'PLAYING'}
              </Text>
              <Text
                fontSize={{
                  base: 'sm',
                  md: '2xl',
                }}
                fontWeight="bold"
                textAlign="center"
                minWidth={0}
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {game.getMemberName(game.currPlayerId)}
              </Text>
            </Flex>
          </SimpleGrid>
          <Hide above="md">
            <Flex align="center" justify="center" textAlign="center" mt={2}>
              {game.phase === Phase.bidding && (
                <Heading fontSize="2xl">BID PHASE</Heading>
              )}
              {game.phase === Phase.postgame && (
                <Heading
                  fontSize={{ base: '2xl', md: '3xl' }}
                  textTransform="uppercase"
                  letterSpacing="tight"
                >{`${game.teamNames[winningTeam]} Wins!`}</Heading>
              )}
            </Flex>
          </Hide>

          {game.phase === Phase.bidding && (
            <BidChat
              game={game}
              onClick={handleBid}
              maxH={game.currPlayerId === user.uid ? '30vh' : '50vh'}
            />
          )}
          {(game.phase === Phase.battle || game.phase === Phase.postgame) && (
            <>
              <Grid
                gridTemplateColumns={{
                  base: 'auto auto',
                  md: '0.2fr 1fr 0.2fr',
                }}
                alignItems="center"
                mt={2}
                w="full"
                maxW="container.md"
                userSelect="none"
              >
                {game.bid.team === 0 ? (
                  BidData
                ) : (
                  <Show above="md">
                    <Box />
                  </Show>
                )}
                <Flex
                  align="center"
                  borderRadius="md"
                  w="full"
                  flexGrow={1}
                  onClick={() => {
                    toggleMode();
                  }}
                >
                  <TeamScore
                    score={score[0]}
                    colorScheme={TEAM_COLORS[0]}
                    teamName={game.teamNames[0]}
                  />

                  <Circle
                    mx={{ base: 0, md: 4 }}
                    py={1}
                    px={{ base: 1, md: 3 }}
                    bg={
                      leadingTeam >= 0
                        ? `${TEAM_COLORS[leadingTeam]}.400`
                        : 'blackAlpha.500'
                    }
                    fontWeight="bold"
                    letterSpacing={{ base: 'wide', md: 'widest' }}
                    fontSize="sm"
                    color="whiteAlpha.800"
                    minW={{ base: '80px', md: '100px' }}
                    cursor="pointer"
                  >
                    {scoreModeLabel}
                  </Circle>

                  <TeamScore
                    score={score[1]}
                    colorScheme={TEAM_COLORS[1]}
                    teamName={game.teamNames[1]}
                    direction="right"
                  />
                </Flex>
                {game.bid.team === 1 && BidData}
              </Grid>
              {game.phase === Phase.battle ? (
                <HStack>
                  {game.plays?.map((play) => (
                    <Stack
                      key={`${play.card.value}-${play.card.suit}-${play.playerId}`}
                    >
                      <PlayingCard card={play.card} />
                      <Text>
                        {game.getPlayerPublicData(play.playerId).displayName}
                      </Text>
                    </Stack>
                  ))}
                </HStack>
              ) : game.phase === Phase.postgame ? (
                <>
                  {game.host.uid === user.uid && (
                    <ButtonGroup mt={8} mb={4}>
                      <Button>Back to Lobby</Button>
                      <Button>Play Again</Button>
                    </ButtonGroup>
                  )}
                  <TableContainer mt={4} mb={64}>
                    <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                      <Thead>
                        <Tr>
                          {game.players.map((player) => (
                            <Th
                              key={`header-${player}`}
                              color={`${
                                TEAM_COLORS[game.getMemberData(player).role]
                              }.400`}
                            >
                              {game.getMemberName(player)}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {game.roundHistory
                          .map((round, i) => ({ ...round, roundNum: i }))
                          .map((round) => (
                            <Tr key={`round-${JSON.stringify(round.plays)}`}>
                              {game.players.map((player) => {
                                const play = round.plays.find(
                                  (p) => p.playerId === player
                                );

                                return (
                                  <Td
                                    key={`card-${play.playerId}-${round.roundNum}`}
                                    opacity={
                                      round.playerId === player ? 1 : 0.5
                                    }
                                  >
                                    <CardMini
                                      card={play.card}
                                      size={{ base: 'sm', md: 'md' }}
                                    />
                                  </Td>
                                );
                              })}
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </>
              ) : null}
            </>
          )}
        </Container>
        <Stack w="full" pos="fixed" bottom={0}>
          <PlayingCardHand
            cards={playerCards}
            hide={!showHand}
            disableHand={
              disableHand || isUpdating || game.phase !== Phase.battle
            }
            disableSuits={disableSuits}
            onClick={(card) => {
              if (game.phase === Phase.battle && !isSpectator) {
                handlePlayCard(card.id);
              }
            }}
          />
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
