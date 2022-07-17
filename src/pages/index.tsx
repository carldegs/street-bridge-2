import { Center, Heading, Text } from '@chakra-ui/layout';
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Binoculars, Coffee, GitBranch } from 'phosphor-react';

import ContributeModal from '../components/ContributeModal';
import PhosphorIcon from '../components/PhosphorIcon';
import useCustomColorMode from '../hooks/useCustomColorMode';

const Home: React.FC = () => {
  const router = useRouter();
  const contributeModalDisc = useDisclosure();
  const colorMode = useCustomColorMode();

  return (
    <Flex flexDir="column" h="100vh">
      <ContributeModal {...contributeModalDisc} />
      <Flex justify="flex-end" py={4} px={8}>
        <Tooltip label={colorMode.tooltip}>
          <IconButton
            icon={<PhosphorIcon icon={colorMode.Icon} />}
            aria-label={colorMode.tooltip}
            onClick={colorMode.toggle}
          />
        </Tooltip>
      </Flex>
      <Center py={4} flexDir="column" flexGrow={1}>
        <Heading
          fontWeight="light"
          fontSize="4xl"
          letterSpacing="2.3rem"
          textAlign="center"
          ml="2.3rem"
        >
          STREET
        </Heading>
        <Heading
          fontFamily="Maragsa"
          fontWeight="medium"
          fontSize="9xl"
          letterSpacing="tight"
          textAlign="center"
          mt={-3}
        >
          bridge
        </Heading>

        <Text letterSpacing="wide" fontSize="xl" my={8}>
          Not your lola&apos;s contract bridge game.
        </Text>

        <Button
          onClick={() => {
            router.push('/play');
          }}
          mt={5}
          colorScheme="teal"
          size="lg"
          maxW="400px"
          w="full"
          _hover={{
            transform: 'scale(1.05)',
          }}
          transition="250ms cubic-bezier(.29,.91,.32,.96)"
        >
          PLAY NOW
        </Button>
      </Center>
      <Flex
        px={8}
        py={3}
        flexDir={{ base: 'row-reverse', md: 'row' }}
        justify={{ base: 'center', md: 'space-between' }}
        align="center"
      >
        <Text pl={{ base: 8, md: 0 }}>v0.1.0</Text>
        <HStack>
          <Text>by carldegs</Text>
          <Tooltip label="GitHub Repo">
            <Link isExternal href="https://github.com/carldegs/street-bridge-2">
              <IconButton aria-label="GitHub Repository">
                <PhosphorIcon icon={GitBranch} fontWeight="bold" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip label="Check out my other projects/games">
            <Link isExternal href="https://www.carldegs.com/">
              <IconButton aria-label="Other Projects">
                <PhosphorIcon icon={Binoculars} fontWeight="bold" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip label="Pa-kape ka naman!">
            <IconButton
              aria-label="Pa-kape ka naman!"
              onClick={contributeModalDisc.onOpen}
            >
              <PhosphorIcon icon={Coffee} fontWeight="bold" />
            </IconButton>
          </Tooltip>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Home;
