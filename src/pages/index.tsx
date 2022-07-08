import { Center, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Center py={4} h="100vh" flexDir="column">
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
  );
};

export default Home;
