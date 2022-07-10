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

const DeleteRoomAlert: React.FC<Props> = ({ onClick, ...props }) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog leastDestructiveRef={cancelRef} {...props}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete Room</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete the room? This cannot be undone.
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
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteRoomAlert;
