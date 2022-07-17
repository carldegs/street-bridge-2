import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import GCashQR from '../../public/img/gcash-qr.png';
import MayaQR from '../../public/img/maya-qr.png';

const ContributeModal: React.FC<Omit<ModalProps, 'children'>> = (props) => (
  <Modal {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>Liked the game?</ModalHeader>
      <ModalBody>
        <Text mb={8}>If you can, pa-kape ka naman!</Text>
        <Tabs>
          <TabList>
            <Tab>Ko-fi</Tab>
            <Tab>GCash</Tab>
            <Tab>Maya</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Link isExternal href="https://ko-fi.com/carldegs" w="full">
                <Button
                  colorScheme="linkedin"
                  bg="#29abe0"
                  size="lg"
                  w="full"
                  my={8}
                >
                  <Image
                    alt="Ko-fi Icon"
                    src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png"
                    w="40px"
                    h="40px"
                    mr={1}
                  />
                  Ko-fi
                </Button>
              </Link>
            </TabPanel>
            <TabPanel>
              <NextImage src={GCashQR} />
            </TabPanel>
            <TabPanel>
              <NextImage src={MayaQR} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ContributeModal;
