import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
} from '@chakra-ui/react';
import React from 'react';

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  onClick: () => void;
}

const EndGameAlert: React.FC<Props> = ({ onClick, ...props }) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog leastDestructiveRef={cancelRef} {...props}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>End Game</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to end this game and return to the lobby?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose} mr={4}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClick();
                props.onClose();
              }}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default EndGameAlert;
