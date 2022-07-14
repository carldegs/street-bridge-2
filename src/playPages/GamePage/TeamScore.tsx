import { ButtonProps, Flex, Text } from '@chakra-ui/react';

const TeamScore: React.FC<{
  score: any;
  colorScheme: ButtonProps['colorScheme'];
  teamName?: string;
  direction?: 'left' | 'right' | 'center';
}> = ({ score, colorScheme, teamName, direction = 'left' }) => {
  return (
    <Flex
      // align={{
      //   base: 'center',
      //   md:
      //     direction === 'left'
      //       ? 'end'
      //       : direction === 'right'
      //       ? 'start'
      //       : 'center',
      // }}
      align={
        direction === 'left'
          ? 'end'
          : direction === 'right'
          ? 'start'
          : 'center'
      }
      // flexDir={{
      //   base: direction === 'left' ? 'row-reverse' : 'row',
      //   md: 'column',
      // }}
      flexDir="column"
      color={`${colorScheme}.400`}
      flexBasis={0}
      flexGrow={1}
    >
      <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" mx={2}>
        {score}
      </Text>
      {teamName && (
        <Text
          my={-1.5}
          mx={1}
          minWidth={0}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW={['90px', '120px', '180px']}
        >
          {teamName}
        </Text>
      )}
    </Flex>
  );
};

export default TeamScore;
