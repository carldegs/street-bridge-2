import { Center, Heading } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import PublicNavbar from '../components/PublicNavbar';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Flex w="full" h="100vh" flexDir="column">
      <PublicNavbar />
      <Center py={4} flexDir="column" flexGrow={1}>
        <Heading>Street Bridge</Heading>
        <Button
          onClick={() => {
            router.push('/play');
          }}
          mt={5}
          colorScheme="teal"
          size="lg"
        >
          PLAY NOW
        </Button>
      </Center>
    </Flex>
  );
};

export default Home;
