import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
} from '@chakra-ui/react';
import { Robot, Eye } from 'phosphor-react';
import React from 'react';

import PhosphorIcon from '../../../components/PhosphorIcon';
import { AUTO_LOOP } from '../../../constants';

export function HandSelectionMenu({
  selectedUser,
  setSelectedUser,
  players,
  isAuto,
}) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant={isAuto ? 'solid' : 'ghost'}
        colorScheme={isAuto ? 'teal' : 'gray'}
        leftIcon={<PhosphorIcon icon={isAuto ? Robot : Eye} fontSize="2xl" />}
        size={{
          base: 'md',
          md: 'lg',
        }}
      >
        {selectedUser}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          defaultValue={AUTO_LOOP}
          type="radio"
          title="VIEW PLAYER'S HAND"
          onChange={(value) => {
            setSelectedUser(value as string);
          }}
        >
          <MenuItemOption value={AUTO_LOOP}>Current Player</MenuItemOption>
          <MenuDivider />
          {players.map(({ label, value }) => (
            <MenuItemOption value={value} key={`menu-option/${value}`}>
              {label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
