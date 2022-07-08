import {
  Button,
  ButtonProps,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactNode, useMemo } from 'react';

import { RFCC } from '../types';

interface DrawerMenuProps {
  title?: string;
  options: {
    onClick: () => void;
    icon: ReactNode;
    text: string;
    hidden?: boolean;
  }[];
  buttonContent: ReactNode;
  menuButtonProps?: ButtonProps;
  drawerButtonProps?: ButtonProps;
}

const DrawerMenu: RFCC<DrawerMenuProps> = ({
  title,
  options,
  buttonContent,
  menuButtonProps,
}) => {
  const isDrawer = useBreakpointValue({ base: true, md: false });
  const disc = useDisclosure();

  const filteredOptions = useMemo(
    () => options?.filter((option) => !option.hidden),
    [options]
  );

  if (isDrawer) {
    return (
      <>
        <Button
          size="sm"
          variant="ghost"
          ml="2"
          opacity={0.7}
          onClick={disc.onOpen}
        >
          {buttonContent}
        </Button>
        <Drawer isOpen={disc.isOpen} onClose={disc.onClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            {title && <DrawerHeader>{title}</DrawerHeader>}
            <DrawerBody>
              <Stack>
                {filteredOptions?.map((option) => (
                  <React.Fragment key={option.text}>
                    <HStack
                      spacing={4}
                      py={3}
                      onClick={() => {
                        option.onClick();
                        disc.onClose();
                      }}
                    >
                      <Icon fontSize="24px">{option.icon}</Icon>
                      <Text>{option.text}</Text>
                    </HStack>
                    <Divider />
                  </React.Fragment>
                ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  } else {
    return (
      <Menu>
        <MenuButton {...menuButtonProps}>{buttonContent}</MenuButton>
        <MenuList>
          {filteredOptions?.map((option) => (
            <MenuItem
              icon={<Icon fontSize="24px">{option.icon}</Icon>}
              onClick={option.onClick}
              key={option.text}
            >
              {option.text}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }
};

export default DrawerMenu;
