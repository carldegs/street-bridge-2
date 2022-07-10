import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spacer,
  Spinner,
  useClipboard,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Sliders, Backspace, Trash, StarFour } from 'phosphor-react';
import React, { useEffect, useState } from 'react';

import DeleteRoomAlert from '../../components/DeleteRoomAlert';
import DrawerMenu from '../../components/DrawerMenu';
import { LobbyCodeCard } from '../../components/LobbyCodeCard';
import { Team, LobbyRole, TEAM_COLORS } from '../../constants';
import useCustomColorMode from '../../hooks/useCustomColorMode';
import ChangeHostModal from './ChangeHostModal';
import EditTeamNameModal from './EditTeamNameModal';
import LeaveRoomAlert from './LeaveRoomAlert';
import MoveMemberModal from './MoveMemberModal';
import TeamCard from './TeamCard';
import TeamCardHeader from './TeamCardHeader';
import TeamCardList from './TeamCardList';
import TeamJoinButton from './TeamJoinButton';
import useSetupPage from './useSetupPage';

const SetupPage: React.FC = () => {
  const toast = useToast();

  const {
    lobby,
    isLoading,
    lobbyError,
    user,
    changeTeam,
    handleRemoveMember,
    handleMoveMember,
    fetch,
    handleChangeHost,
    handleDeleteRoom,
    handleLeaveRoom,
    handleChangeTeamName,
    handleCreateGame,
  } = useSetupPage();
  const [leftRoom, setLeftRoom] = useState(false);
  const deleteRoomAlertDisc = useDisclosure();
  const leaveRoomAlertDisc = useDisclosure();
  const changeHostDisc = useDisclosure();
  const changeHostLeaveDisc = useDisclosure();
  const codeClipboard = useClipboard(lobby?.code);
  const changeTeamNameDisc = useDisclosure();
  const [nameChangeTeam, setNameChangeTeam] = useState(Team.vertical);
  const moveMemberDisc = useDisclosure();
  const [moveData, setMoveData] = useState<{ uid: string; role: LobbyRole }>({
    uid: '',
    role: 'spectator',
  });
  const [isCreating, setCreating] = useState(false);
  const colorMode = useCustomColorMode();

  useEffect(() => {
    if (!isLoading && lobbyError) {
      toast({
        status: 'error',
        title: 'Cannot fetch lobby',
        description: lobbyError.message,
        isClosable: true,
      });
    }
  }, [isLoading, lobbyError, toast]);

  useEffect(() => {
    if ((lobby && !lobby.members[user.uid]) || (!lobby && !isLoading)) {
      fetch(user);

      if (!leftRoom) {
        toast({
          status: 'error',
          title: 'Forbidden Access',
          description:
            'You have no access to the room or the room does not exist.',
          isClosable: true,
        });
      } else {
        setLeftRoom(false);
      }
    }
  }, [fetch, isLoading, leftRoom, lobby, toast, user, user.uid]);

  useEffect(() => {
    if (lobby?.currGame) {
      fetch(user);
    }
  }, [fetch, lobby?.currGame, user]);

  if (!lobby) {
    return (
      <Center w="full" h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box mb={8}>
      <LeaveRoomAlert
        onClick={() => {
          if (!lobby.isHost(user.uid)) {
            handleLeaveRoom();
          } else {
            changeHostLeaveDisc.onOpen();
            leaveRoomAlertDisc.onClose();
          }

          setLeftRoom(true);
        }}
        {...leaveRoomAlertDisc}
      />
      <DeleteRoomAlert
        onClick={async () => {
          await handleDeleteRoom();

          setLeftRoom(true);
          fetch(user);
        }}
        {...deleteRoomAlertDisc}
      />
      <ChangeHostModal
        onClick={handleChangeHost}
        options={Object.values(lobby?.members || {})
          ?.filter(({ uid }) => uid !== lobby?.host?.uid)
          ?.map(({ uid, displayName }) => ({
            label: displayName,
            value: uid,
          }))}
        {...changeHostDisc}
      />
      <ChangeHostModal
        onClick={(host) => {
          handleChangeHost(host);
          handleLeaveRoom();
        }}
        options={Object.values(lobby?.members || {})
          ?.filter(({ uid }) => uid !== lobby?.host?.uid)
          ?.map(({ uid, displayName }) => ({
            label: displayName,
            value: uid,
          }))}
        {...changeHostLeaveDisc}
      />
      {changeTeamNameDisc.isOpen && (
        <EditTeamNameModal
          onClick={(name) => {
            handleChangeTeamName(nameChangeTeam, name);
          }}
          value={lobby.teamNames[nameChangeTeam]}
          {...changeTeamNameDisc}
        />
      )}
      <MoveMemberModal
        onClick={(uid, role) => {
          handleMoveMember(uid, role);
        }}
        lobby={lobby}
        userToMove={moveData.uid}
        {...moveMemberDisc}
      />
      <Flex
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bg="teal.500"
        py={2}
        px={6}
      >
        <Heading fontSize="md" color="gray.50">
          STREET BRIDGE
        </Heading>
        <Spacer />
        <Heading fontSize="md" color="teal.200">
          {user.displayName}
        </Heading>
      </Flex>
      {isLoading && <Spinner size="xl" />}
      {lobby && (
        <Container maxW="container.md" flexDir="column" pt={8}>
          <HStack mb={8}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }}>Setup Game</Heading>
            <Spacer />
            <LobbyCodeCard onClick={codeClipboard.onCopy} code={lobby.code} />
            <Box w={{ base: 0, md: 2 }} />
            <DrawerMenu
              title="Options"
              options={[
                {
                  text: 'Leave Room',
                  icon: <Backspace />,
                  onClick: leaveRoomAlertDisc.onOpen,
                  hidden: lobby.numMembers <= 1,
                },
                {
                  text: 'Delete Room',
                  icon: <Trash />,
                  onClick: deleteRoomAlertDisc.onOpen,
                  hidden: lobby.host.uid !== user.uid,
                },
                {
                  text: 'Change Host',
                  icon: <StarFour />,
                  onClick: changeHostDisc.onOpen,
                  hidden: lobby.host.uid !== user.uid,
                },
                {
                  text: colorMode.tooltip,
                  icon: <colorMode.Icon />,
                  onClick: colorMode.toggle,
                },
              ]}
              buttonContent={
                <Icon mx="auto" fontSize="24px">
                  <Sliders weight="fill" />
                </Icon>
              }
              menuButtonProps={{
                as: IconButton,
                variant: 'ghost',
                size: 'lg',
                borderRadius: 'full',
              }}
            />
          </HStack>

          {lobby.isHost(user.uid) && (
            <Button
              w="full"
              colorScheme="green"
              mb={6}
              size="lg"
              isDisabled={!lobby.isCompleteTeams()}
              isLoading={isCreating}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  setCreating(true);
                  await handleCreateGame();
                  setCreating(false);
                } catch (err) {
                  toast({
                    status: 'error',
                    title: 'Cannot create game',
                    description: err?.message,
                  });
                }
                fetch(user);
              }}
            >
              START GAME
            </Button>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <TeamCard colortheme={TEAM_COLORS[0]}>
              <TeamCardHeader
                // TODO: Make it cleaner
                onClick={
                  lobby.isTeamMember(user.uid, 0) || lobby.isHost(user.uid)
                    ? () => {
                        setNameChangeTeam(0);
                        changeTeamNameDisc.onOpen();
                      }
                    : undefined
                }
              >
                {lobby.teamNames[0]}
              </TeamCardHeader>
              <TeamCardList
                members={lobby.getPlayerList(0)}
                currUserId={user.uid}
                hostUserId={lobby.host.uid}
                onRemoveMember={handleRemoveMember}
                onMoveMember={(uid) => {
                  setMoveData({ uid, role: 0 });
                  moveMemberDisc.onOpen();
                }}
                neededMembers={2}
              />
              <Spacer />
              <TeamJoinButton
                colorScheme={TEAM_COLORS[0]}
                onClick={changeTeam}
                team={0}
                userTeam={lobby.members[user.uid]?.role}
              />
            </TeamCard>
            <TeamCard colortheme={TEAM_COLORS[1]}>
              <TeamCardHeader
                // TODO: Make it cleaner
                onClick={
                  lobby.isTeamMember(user.uid, 1) || lobby.isHost(user.uid)
                    ? () => {
                        setNameChangeTeam(1);
                        changeTeamNameDisc.onOpen();
                      }
                    : undefined
                }
              >
                {lobby.teamNames[1]}
              </TeamCardHeader>
              <TeamCardList
                members={lobby.getPlayerList(1)}
                currUserId={user.uid}
                hostUserId={lobby.host.uid}
                onRemoveMember={handleRemoveMember}
                onMoveMember={(uid) => {
                  setMoveData({ uid, role: 1 });
                  moveMemberDisc.onOpen();
                }}
                neededMembers={2}
              />
              <Spacer />
              <TeamJoinButton
                colorScheme={TEAM_COLORS[1]}
                onClick={changeTeam}
                team={1}
                userTeam={lobby.members[user.uid]?.role}
              />
            </TeamCard>
            <TeamCard colortheme={TEAM_COLORS.spectator} gridColumn="1 / -1">
              <TeamCardHeader>Spectators</TeamCardHeader>
              <TeamCardList
                members={lobby.getPlayerList('spectator')}
                currUserId={user.uid}
                hostUserId={lobby.host.uid}
                onRemoveMember={handleRemoveMember}
                onMoveMember={(uid) => {
                  setMoveData({ uid, role: 'spectator' });
                  moveMemberDisc.onOpen();
                }}
              />
              <TeamJoinButton
                colorScheme={TEAM_COLORS.spectator}
                onClick={changeTeam}
                team="spectator"
                userTeam={lobby.members[user.uid]?.role}
              />
            </TeamCard>
          </SimpleGrid>
        </Container>
      )}
    </Box>
  );
};

export default SetupPage;
