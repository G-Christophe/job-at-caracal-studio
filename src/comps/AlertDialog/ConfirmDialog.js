import React from 'react';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react'

const ConfirmDialog = ({ isOpen, onOpen, onClose, onConfirm }) => {
  const cancelRef = React.useRef()

  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay>

        <AlertDialogContent>
          <AlertDialogHeader>Delete Entries</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete entries? <br />This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="solid">
             Cancel
            </Button>
            <Button variant="solid" onClick={onConfirm} colorScheme='red' ml={3}>
             Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ConfirmDialog;