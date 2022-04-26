import React, { useState } from 'react';
import validator from 'validator';
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Text, Heading, Input, Button, ModalCloseButton } from '@chakra-ui/react';
import { Helpers } from '../../services/dbHelpers';

export const GoProModal = (props: any) => {
    const [email, setEmail] = useState('');

    const _saveEmail = async () => {
        console.log('Saving email: %s', email);
        if(!validator.isEmail(email)) {
            alert('Please enter a valid email address!');
            return;
        }
        Helpers.saveProEmail(email);
        props.onClose();
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalBody textAlign={'center'}>
                    <Heading fontFamily={'Langar'}>Trygger Pro Coming Soon!</Heading>
                    <Text margin={'20px 15px 20px 15px'}>Trygger Pro, with unlimited Tryggers and our Whale Watch, among other extra features, is still in development and will be coming soon.</Text>
                    <Text margin={'20px 15px 20px 15px'}>Enter your email to be the first to know when we drop Trygger Pro (and maybe get yourself a little discount)!</Text>
                    <Input placeholder='Email' onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value);
                    })}></Input>
                    <Button margin={'20px 0px 20px 0px'} fontFamily={'Langar'} bgColor={'#FFFF00'} onClick={_saveEmail}>Save Email</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}