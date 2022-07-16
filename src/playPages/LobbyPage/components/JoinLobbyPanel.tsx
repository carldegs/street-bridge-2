import { useToast, Box, Heading, Stack, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import QFormControl from '../../../components/QFormControl';
import useCustomColorMode from '../../../hooks/useCustomColorMode';
import useJoiForm from '../../../hooks/useJoiForm';
import { joinRoomFormObject } from '../formObjects';
import useLobbyPage from '../useLobbyPage';

const JoinLobbyPanel: React.FC = () => {
  const toast = useToast();
  const { handleJoinLobby, user } = useLobbyPage();
  const methods = useJoiForm(joinRoomFormObject, {
    name: user?.displayName || '',
  });
  const [isLoading, setLoading] = useState(false);
  const colorMode = useCustomColorMode();

  return (
    <Box
      bg={colorMode.isDark ? 'gray.900' : 'white'}
      py={6}
      px={10}
      borderRadius="lg"
      w="full"
      maxW="400px"
    >
      <Heading mb={8} fontSize="xl">
        Join a Room
      </Heading>
      <FormProvider {...methods}>
        <Stack spacing={8} w="full">
          <Heading fontSize="lg">{user.uid}</Heading>
          <QFormControl name="code" label="Room Code" isRequired>
            <Input variant="flushed" />
          </QFormControl>

          <QFormControl name="name" label="Name" isRequired>
            <Input variant="flushed" />
          </QFormControl>

          <Button
            isLoading={isLoading}
            onClick={methods.handleSubmit(async ({ code, name }) => {
              setLoading(true);
              try {
                await handleJoinLobby(code, name);
              } catch (err) {
                toast({
                  status: 'error',
                  title: 'Cannot Join Room',
                  description: err?.message,
                });
              }
              setLoading(false);
            })}
            colorScheme="teal"
          >
            JOIN
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );
};

export default JoinLobbyPanel;
