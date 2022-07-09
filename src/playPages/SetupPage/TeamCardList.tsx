import {
  ColorProps,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { StarFour, Sliders, UserMinus, Swap } from 'phosphor-react';
import React from 'react';

import DrawerMenu from '../../components/DrawerMenu';
import { LobbyMember, RFCC } from '../../types';

export const TeamCardList: RFCC<{
  colortheme?: ColorProps['color'];
  members: LobbyMember[];
  currUserId: string;
  hostUserId: string;
  onRemoveMember: (uid: string) => void;
  onMoveMember: (uid: string) => void;
  neededMembers?: number;
}> = ({
  colortheme,
  members,
  currUserId,
  hostUserId,
  onRemoveMember,
  onMoveMember,
  neededMembers,
}) => {
  const numNeeded =
    isNaN(neededMembers) || neededMembers < members?.length
      ? 0
      : neededMembers - (members?.length || 0);

  return (
    <Stack color={colortheme} spacing={4} alignItems="center" minH="100px">
      {members.map((member) => (
        <Text fontSize="xl" key={member.uid} color={`${colortheme}.800`}>
          {member.displayName}
          {member.uid === hostUserId && (
            <Tooltip label="Host">
              <Icon fontSize="xl" ml={1} opacity={0.7} _hover={{ opacity: 1 }}>
                <StarFour weight="fill" />
              </Icon>
            </Tooltip>
          )}
          {!!(currUserId === hostUserId && currUserId !== member.uid) && (
            <DrawerMenu
              title={member.displayName}
              options={[
                {
                  text: 'Remove Member',
                  icon: <UserMinus />,
                  onClick: () => onRemoveMember(member.uid),
                },
                {
                  text: 'Move Member',
                  icon: <Swap />,
                  onClick: () => onMoveMember(member.uid),
                },
              ]}
              buttonContent={
                <Icon mx="auto" fontSize="24px">
                  <Sliders weight="fill" />
                </Icon>
              }
              menuButtonProps={{
                as: IconButton,
                size: 'sm',
                variant: 'ghost',
                ml: 2,
                opacity: 0.7,
              }}
            />
          )}
        </Text>
      ))}
      {numNeeded &&
        Array.from(Array(numNeeded).keys())
          .map((_, i) => i)
          .map((i) => (
            <Text
              key={`player-needed-${colortheme}-${i}`}
              color={`${colortheme}.800`}
              opacity="0.5"
              // fontSize="xl"
              fontWeight="bold"
              letterSpacing="widest"
              py="5px"
            >
              (PLAYER NEEDED)
            </Text>
          ))}
    </Stack>
  );
};

export default TeamCardList;
