import { ColorProps, Flex, Heading, Icon, Tooltip } from '@chakra-ui/react';
import { PencilSimple } from 'phosphor-react';
import React from 'react';

import { RFCC } from '../../types';

const TeamCardHeader: RFCC<{
  colortheme?: ColorProps['color'];
  onClick?: () => void;
}> = ({ children, colortheme = 'gray', onClick }) => (
  <Tooltip label="Edit Team Name" placement="top" isDisabled={!onClick}>
    <Flex
      role="group"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      mb={8}
    >
      <Heading fontSize="xl" textAlign="center" color={`${colortheme}.800`}>
        {children}
      </Heading>

      {onClick && (
        <Icon
          fontSize="2xl"
          ml={1}
          color={`${colortheme}.800`}
          opacity="0.5"
          _groupHover={{ opacity: 1 }}
        >
          <PencilSimple />
        </Icon>
      )}
    </Flex>
  </Tooltip>
);

export default TeamCardHeader;
