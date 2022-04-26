import React, { useEffect, useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, ModalHeader,
    Box, Text, Center, Heading,
    Select,
    Input,
    CheckboxGroup,
    Checkbox,
    InputGroup,
    InputLeftAddon,
    Button,
    Spinner
} from '@chakra-ui/react';
import validator from 'validator';
import { ethers } from 'ethers';
import { supabase } from '../../services/supabaseClient';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import { Helpers } from '../../services/dbHelpers';

export interface IFormData {
    userId: string;
    chain: string;
    type: string;
    action: string;
    actionDetails: any;
    triggerDetails: any;
}

export const NewTryggerModal = (props: any) => {
    const user = useRecoilValue(userState);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({} as IFormData);
    const [step, setStep] = useState(1);

    const _clearAndClose = () => {
        setIsLoading(false);
        setStep(1);
        setFormData({...{}, userId: user!.id, chain: 'eth', action: 'sms', type: 'wallet'} as IFormData);
        props.onClose();
    }

    useEffect(() => {
        setFormData({...formData, userId: user!.id, chain: 'eth', action: 'sms', type: 'wallet'})
    }, [])

    return (
        <Modal isOpen={props.isOpen} onClose={_clearAndClose} onEsc={_clearAndClose} onOverlayClick={_clearAndClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'1.75em'} textAlign={'center'} fontFamily={'Langar'}>Create a New Trygger</ModalHeader>
                {
                    step === 1 ?
                    <ModalBody>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Chain</Heading>
                        <Select value='eth'>
                            <option value='eth'>Ethereum</option>
                            <option style={{color: 'gray'}} value=''>Polygon (coming soon)</option>
                            <option style={{color: 'gray'}} value=''>Arbitrum (coming soon)</option>
                            <option style={{color: 'gray'}} value=''>Optimism (coming soon)</option>
                            <option style={{color: 'gray'}} value=''>Solana (coming soon)</option>
                            <option style={{color: 'gray'}} value=''>Bitcoin (coming soon)</option>
                        </Select>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Trygger Type</Heading>
                        <Select value={formData.type} onChange={((event: React.ChangeEvent<HTMLSelectElement>) => {
                            if(['wallet', 'erc20'].includes(event.target.value) && formData.type !== event.target.value) {
                                setFormData({... formData, type: event.target.value, triggerDetails: {}});
                            }
                        })}>
                            <option value='wallet'>Wallet Monitor</option>
                            <option value='erc20'>ERC20 Transfers</option>
                            <option value='nft'>NFT Transfers</option>
                            <option style={{color: 'gray'}} value='gas'>Gas Alerts (Pro - Coming Soon)</option>
                            <option style={{color: 'gray'}} value='price'>Price Alert (Pro - Coming Soon)</option>
                            <option style={{color: 'gray'}} value='whale'>Whale Movement (Pro - Coming Soon)</option>
                            <option style={{color: 'gray'}} value='custom'>Custom Events (Pro - Coming Soon)</option>
                        </Select>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Action</Heading>
                        <Select value={formData.action} onChange={((event: React.ChangeEvent<HTMLSelectElement>) => {
                            if(['sms', 'email'].includes(event.target.value)) {
                                setFormData({... formData, action: event.target.value, actionDetails: {}});
                            }
                        })}>
                            <option value='sms'>Send SMS</option>
                            <option value='email'>Send Email</option>
                            <option style={{color: 'gray'}} value='telegram'>Send Telegram Message (coming soon)</option>
                            <option style={{color: 'gray'}} value='discord'>Send Discord Message (coming soon)</option>
                            <option style={{color: 'gray'}} value='whatsapp'>Send WhatsApp Message (coming soon)</option>
                        </Select>
                        {
                            formData.action === 'sms' || formData.action === undefined ? 
                            <Box>
                                <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Phone Number</Heading>
                                <InputGroup>
                                    <InputLeftAddon>+1</InputLeftAddon>
                                    <Input value={formData.actionDetails ? formData.actionDetails['phoneNumber'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData({... formData, actionDetails: {... formData.actionDetails, 'phoneNumber': event.target.value}});
                                    })}></Input>
                                </InputGroup>
                            </Box> 
                            : 
                            <Box>
                                <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Email</Heading>
                                <Input value={formData.actionDetails ? formData.actionDetails['email'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFormData({... formData, actionDetails: {... formData.actionDetails, 'email': event.target.value}});
                                })}></Input>
                            </Box>
                        }
                    </ModalBody>
                    : formData.type === 'wallet' ?
                    <ModalBody>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Wallet Address</Heading>
                        <Input value={formData?.triggerDetails ? formData?.triggerDetails['walletAddress'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData({... formData, triggerDetails: {... formData.triggerDetails, 'walletAddress': event.target.value}});
                        })}></Input>
                        <Center>
                            <CheckboxGroup>
                                <Checkbox defaultChecked margin={'15px 25px'} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFormData({... formData, triggerDetails: {... formData.triggerDetails ?? {}, 'to': event.target.checked}});
                                })}>To</Checkbox>
                                <Checkbox defaultChecked onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFormData({... formData, triggerDetails: {... formData.triggerDetails ?? {}, 'from': event.target.checked}});
                                })}>From</Checkbox>
                            </CheckboxGroup>
                        </Center>
                    </ModalBody>
                    : 
                    <ModalBody>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Token Contract Address</Heading>
                        <Input value={formData?.triggerDetails ? formData?.triggerDetails['contractAddress'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData({... formData, triggerDetails: {... formData.triggerDetails, 'contractAddress': event.target.value}});
                        })}></Input>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>To Address</Heading>
                        <Input value={formData?.triggerDetails ? formData?.triggerDetails['toAddress'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData({... formData, triggerDetails: {... formData.triggerDetails, 'toAddress': event.target.value}});
                        })}></Input>
                        <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>From Address</Heading>
                        <Input value={formData?.triggerDetails ? formData?.triggerDetails['fromAddress'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData({... formData, triggerDetails: {... formData.triggerDetails, 'fromAddress': event.target.value}});
                        })}></Input>
                    </ModalBody>
                }
                {
                    step === 1 ? 
                        <ModalFooter justifyContent={'space-between'}>
                            <Button onClick={_clearAndClose}>Cancel</Button>
                            <Button bgColor={'#FFFF00'} onClick={(() => {
                                if(formData.action === 'sms') {
                                    console.log(`Phone Number: ${formData.actionDetails?.phoneNumber}`)
                                    if(!validator.isMobilePhone(formData.actionDetails?.phoneNumber ?? '')) {
                                        alert('Please enter a valid phone number!');
                                        return;
                                    }
                                }
                                if(formData.action === 'email') {
                                    console.log(`Email: ${formData.actionDetails?.email}`)
                                    if(!validator.isEmail(formData.actionDetails?.email ?? '')) {
                                        alert('Please enter a valid email!');
                                        return;
                                    }
                                }
                                setStep(2);
                            })}>Next</Button>
                        </ModalFooter>
                    :
                        <ModalFooter justifyContent={'space-between'}>
                            <Button onClick={(() => {setStep(1)})}>Back</Button>
                            <Button bgColor={'#FFFF00'} onClick={(async () => {
                                if(isLoading) {
                                    return
                                }
                                setIsLoading(true);
                                //check that wallet address is valid
                                let tryggerData = formData;
                                if(formData.type === 'wallet') {
                                    //set to and from if they are empty to true
                                    let details = {... formData.triggerDetails, 'to': formData?.triggerDetails?.to ?? true, 'from': formData?.triggerDetails?.from ?? true};
                                    console.log(`Details: ${JSON.stringify(details)}`);
                                    tryggerData = {... formData, triggerDetails: details};
                                    try {
                                        ethers.utils.getAddress(formData.triggerDetails['walletAddress'] ?? '');
                                    } catch (e) {
                                        alert('Please enter a valid wallet address!');
                                        setIsLoading(false);
                                        return;    
                                    }
                                }
                                if(formData.type === 'erc20') {
                                    //validate ERC20 trygger form data

                                }
                                console.log(`CREATING TRYGGER: ${JSON.stringify(tryggerData)}`)
                                //send create new trygger data to backend
                                let result = await Helpers.createNewTrygger(tryggerData);
                                if(result) {
                                    setFormData({userId: user!.id, chain: 'eth', action: 'sms', type: 'wallet'} as IFormData);
                                    setStep(1);
                                    setIsLoading(false);
                                    _clearAndClose();
                                } else {
                                    alert('We had an error creating your trygger. Please try again!');
                                }
                                setIsLoading(false);
                            })}>{ isLoading ? <Spinner /> : 'Create'}</Button>
                        </ModalFooter>
                }
                
            </ModalContent>
        </Modal>
    )
}