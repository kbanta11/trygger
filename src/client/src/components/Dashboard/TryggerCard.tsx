import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Switch, Text, useDisclosure } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tryggerListState, userState } from '../../atoms';
import { BiTrash } from 'react-icons/bi';
import { Helpers } from '../../services/dbHelpers';


export const TryggerCard = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const user = useRecoilValue(userState);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tryggers, setTryggers] = useRecoilState(tryggerListState);//useState([] as any[]);

    const getTryggers = async () => {
        let userTryggers = await Helpers.getTryggers(user!.id);
        setTryggers(userTryggers);
    }

    let trygger = props.trygger;
    return (
        <Box bgColor={'white'} borderRadius={'10px'} padding={'10px'} textColor={'black'} textAlign={'start'}>
            <Text fontSize={'0.75em'}><span style={{fontWeight: 'bold'}}>Trygger ID:</span> {trygger['id']}</Text>
            <Box display={'flex'} justifyContent={'space-between'} verticalAlign={'center'} padding={'0px 10px 10px 0px'}>
                <FormControl display='flex' alignItems='center' justifyItems={'center'} verticalAlign={'center'}>
                    <FormLabel fontSize={'1.25em'} paddingTop={'3px'}>Active?</FormLabel>
                    <Switch color={'#FFFF00'} size={'sm'} id='active' isChecked={trygger['active'] ?? true} onChange={(async (event: React.ChangeEvent<HTMLInputElement>) => {
                        let success = await Helpers.toggleTrygger(trygger);
                        if(!success) {
                            alert('We had an error toggling this trygger. Please try again!');
                            return;
                        }
                        await getTryggers();
                    })}/>
                </FormControl>
                <Box paddingTop={'5px'}>
                    <BiTrash fontSize={'1.75em'} cursor={'pointer'} onClick={onOpen}/>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader textAlign={'center'}>Confirm Trygger Deletion</ModalHeader>
                            <ModalBody padding={'20px'} textAlign={'center'}>
                                <Text>This will permanently delete this Trygger. Are you sure you want to delete this Trygger?</Text>
                                <Box marginTop={'20px'} display={'flex'} justifyContent={'space-between'}>
                                    <Button onClick={onClose}>Cancel</Button>
                                    <Button bgColor={'#FFFF00'} onClick={(async () => {
                                        setIsLoading(true);
                                        let success = await Helpers.deleteTrygger(trygger['type'], trygger['id']);
                                        if(!success) {
                                            alert('We had an error deleting this trygger. Please try again!');
                                        }
                                        await getTryggers();
                                        setIsLoading(false);
                                        onClose();
                                        })}>{isLoading ? <Spinner /> : 'Delete'}</Button>
                                </Box>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Box>
            </Box>
            <Heading fontSize={'1.5em'}>Chain</Heading>
            <Text paddingBottom={'10px'}>{trygger['chain'] ?? ''}</Text>
            <Heading fontSize={'1.5em'}>Action</Heading>
            <Text paddingBottom={'10px'}>{trygger['action'] ?? ''}</Text>
            <Heading fontSize={'1.5em'}>{trygger['action'] === 'sms' ? 'Phone Number' : 'Email'}</Heading>
            <Text paddingBottom={'10px'}>{trygger['action'] === 'sms' ? trygger['actionDetails']['phoneNumber'] 
                : trygger['action'] === 'email' ? trygger['actionDetails']['email'] ?? '' : ''}</Text>
            <Heading fontSize={'1.5em'}>Type</Heading>
            <Text paddingBottom={'10px'}>{trygger['type'] ?? ''}</Text>
            <Heading fontSize={'1.5em'}>Wallet Address</Heading>
            <Text fontSize={'0.8em'}>{trygger['triggerDetails']['walletAddress'] ?? ''}</Text>
            <Heading fontSize={'1.5em'}>To/From</Heading>
            <Text fontSize={'0.8em'}>{trygger['triggerDetails']['to'] ? 'Yes' : 'No' ?? ''}/{trygger['triggerDetails']['from'] ? 'Yes' : 'No' ?? ''}</Text>
        </Box>
    );
}