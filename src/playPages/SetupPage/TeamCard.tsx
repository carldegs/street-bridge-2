import { BoxProps, ColorProps, Flex } from '@chakra-ui/react';
import React from 'react';

const TeamCard: React.FC<BoxProps & { colortheme: ColorProps['color'] }> = ({
  children,
  colortheme = 'gray',
  ...props
}) => (
  <Flex
    flexDir="column"
    alignItems="center"
    p={4}
    borderRadius="lg"
    w="full"
    bg={`${colortheme}.200`}
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

export default TeamCard;
