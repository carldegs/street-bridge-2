import { BoxProps, ColorProps, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';

const TeamCard: React.FC<BoxProps & { colortheme: ColorProps['color'] }> = ({
  children,
  colortheme = 'gray',
  ...props
}) => {
  const colorMode = useColorMode();
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      p={4}
      borderRadius="lg"
      w="full"
      bg={`${colortheme}.${colorMode.colorMode === 'dark' ? 400 : 200}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { colortheme });
        }
        return child;
      })}
    </Flex>
  );
};

export default TeamCard;
