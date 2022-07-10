import { useToast, Box, Heading, Stack, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import QFormControl from '../../../components/QFormControl';
import useCustomColorMode from '../../../hooks/useCustomColorMode';
import useJoiForm from '../../../hooks/useJoiForm';
import { createRoomFormObject } from '../formObjects';
import useLobbyPage from '../useLobbyPage';

const CreateLobbyPanel: React.FC = () => {
  const toast = useToast();
  const { handleCreateLobby, user } = useLobbyPage();
  const methods = useJoiForm(createRoomFormObject, {
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
        Create New Room
      </Heading>
      <FormProvider {...methods}>
        <Stack spacing={8} w="full">
          <QFormControl name="name" label="Name" isRequired>
            <Input variant="flushed" />
          </QFormControl>

          <Button
            isLoading={isLoading}
            onClick={methods.handleSubmit(async ({ name }) => {
              setLoading(true);
              try {
                await handleCreateLobby(name);
              } catch (err) {
                toast({
                  status: 'error',
                  title: 'Cannot Create Room',
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

export default CreateLobbyPanel;
