import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Box, Select, Heading, Text, Input, Center,
    Popover, PopoverTrigger,Portal, PopoverArrow, 
    PopoverBody, PopoverContent, PopoverCloseButton, Button,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, CheckboxGroup, Checkbox, Spinner } from '@chakra-ui/react';
import validator from 'validator';
import { BiInfoCircle } from 'react-icons/bi';
import { firstTriggerFormState } from '../../atoms';
import { useRecoilState } from 'recoil';
import { supabase } from '../../services/supabaseClient';
import { EmailInput } from './EmailInput';
import { PhoneInput } from './PhoneInput';
import { Helpers } from '../../services/dbHelpers';

export const FirstTryggerForm = () => {
    const [ firstTriggerFormData, setFirstTriggerFormData ] = useRecoilState(firstTriggerFormState);
    const [phoneVerifyCode, setPhoneVerifyCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showConfirmLogin, setShowConfirmLogin] = useState(false);

    async function _handleCreateAccount() {
        if(isLoading) {
            return;
        }
        setIsLoading(true);
        let formData = firstTriggerFormData.updateTriggerDetails({...firstTriggerFormData.triggerDetails, 'to': firstTriggerFormData.triggerDetails['to'] ?? true, 'from': firstTriggerFormData.triggerDetails['from'] ?? true})
        if(firstTriggerFormData.action === 'sms') {
            let finalFormData = formData.updateActionDetails({...formData.actionDetails, 'phoneNumber': `1${formData.actionDetails['phoneNumber']}`});
            let { user, error, } = await supabase.auth.signIn({phone: `+${finalFormData.actionDetails['phoneNumber']}`, });
            console.log(`User: ${JSON.stringify(user)}\nError: ${JSON.stringify(error)}`);
            if(error) {
                alert('We\'re sorry, we had an error creating your account. Please try again. If this continues to happen, please contact us!');
                setIsLoading(false);
                return
            } else {
                //send request to backend to create new user record and create a new trygger if needed
                let newUser = await Helpers.createNewUserWithTrygger(finalFormData);
                setIsNewUser(newUser);
                setShowConfirmLogin(true);
            }
        }
        if(firstTriggerFormData.action === 'email') {
            let { user, error, } = await supabase.auth.signIn({email: `${formData.actionDetails['email']}`});
            console.log(`User: ${JSON.stringify(user)}\nError: ${JSON.stringify(error)}`);
            if(error) {
                alert('We\'re sorry, we had an error creating your account. Please try again. If this continues to happen, please contact us!');
                setIsLoading(false);
                return
            } else {
                //send request to backend to create new user record and create a new trygger if needed, return if created a trygger
                let createdTrygger = await Helpers.createNewUserWithTrygger(formData);
                setIsNewUser(createdTrygger);
                setShowConfirmLogin(true);
            }
        }
        setIsLoading(false);
    }

    async function _pullTheTrygger() {
        console.log(JSON.stringify(firstTriggerFormData));
        //validate phone if phone
        let isValidPhone = validator.isMobilePhone(firstTriggerFormData.actionDetails ? `1${firstTriggerFormData.actionDetails['phoneNumber']}` ?? '' : '', 'en-US');
        if(!isValidPhone && firstTriggerFormData.action === 'sms') {
            alert('Please enter a valid phone number (US Only for now)');
            return;
        }

        //validate email if email
        let isValidEmail = validator.isEmail(firstTriggerFormData.actionDetails ? firstTriggerFormData.actionDetails['email'] ?? '' : '')
        if(!isValidEmail && firstTriggerFormData.action === 'email') {
            alert('Please enter a valid email address');
            return;
        }

        //validate wallet
        let isValidWallet = false;
        try {
            ethers.utils.getAddress(firstTriggerFormData.triggerDetails['walletAddress'] ?? '');
            isValidWallet = true;
        } catch (e) {
            alert('Please enter a valid wallet address!');
            return;    
        }
        
        onOpen();
        /*
        let result = await fetch('/testing', {
            method: 'POST',
            headers: {'Content-type': "application/json"},
            body: JSON.stringify(firstTriggerFormData)
        });
        let data = await result.json();
        console.log(JSON.stringify(data));
        */
    }

    return (
        <Box borderRadius={'15px'} bgColor={'white'} margin={'10px'} padding={'10px'} width={['350px', '400px']} alignSelf={'center'}>
            <Box display={'flex'} justifyContent={'center'}>
                <Heading marginRight={'5px'} fontFamily={'Langar'} fontSize={'2em'}>Create Your First Trygger</Heading>
                <Popover placement={'auto-start'}>
                    <PopoverTrigger><span><BiInfoCircle /></span></PopoverTrigger>
                    <Portal>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                Tryggers listen for events and transactions on the blockchain and will fire off your alert when the Trygger conditions are met.
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </Box>
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
            <Select value={firstTriggerFormData.type} onChange={((event: React.ChangeEvent<HTMLSelectElement>) => {
                if(['wallet'].includes(event.target.value)) {
                    setFirstTriggerFormData(firstTriggerFormData.updateType(event.target.value));
                }
            })}>
                <option value='wallet'>Wallet Monitor</option>
                <option value='erc20'>ERC20 Transfers</option>
                <option value='nft'>NFT Transfers</option>
                <option value='gas'>Gas Alerts (Pro - Coming Soon)</option>
                <option value='price'>Price Alert (Pro - Coming Soon)</option>
                <option value='whale'>Whale Movement (Pro - Coming Soon)</option>
                <option value='custom'>Custom Events (Pro - Coming Soon)</option>
            </Select>
            <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Action</Heading>
            <Select value={firstTriggerFormData.action} onChange={((event: React.ChangeEvent<HTMLSelectElement>) => {
                if(['sms', 'email'].includes(event.target.value)) {
                    setFirstTriggerFormData(firstTriggerFormData.updateAction(event.target.value));
                }
            })}>
                <option value='sms'>Send SMS</option>
                <option value='email'>Send Email</option>
                <option style={{color: 'gray'}} value='telegram'>Send Telegram Message (coming soon)</option>
                <option style={{color: 'gray'}} value='discord'>Send Discord Message (coming soon)</option>
                <option style={{color: 'gray'}} value='whatsapp'>Send WhatsApp Message (coming soon)</option>
            </Select>
            {
                firstTriggerFormData.action === 'sms' ? <PhoneInput /> : <EmailInput />
            }
            <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Wallet Address</Heading>
            <Input value={firstTriggerFormData?.triggerDetails ? firstTriggerFormData?.triggerDetails['walletAddress'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                let triggerDetails = firstTriggerFormData.triggerDetails ?? {};
                setFirstTriggerFormData(firstTriggerFormData.updateTriggerDetails({...triggerDetails, 'walletAddress': event.target.value}));
            })}></Input>
            <Center>
                <CheckboxGroup>
                    <Checkbox defaultChecked margin={'15px 25px'} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                        let triggerDetails = firstTriggerFormData.triggerDetails ?? {};
                        setFirstTriggerFormData(firstTriggerFormData.updateTriggerDetails({...triggerDetails, 'to': event.target.checked}));
                    })}>To</Checkbox>
                    <Checkbox defaultChecked onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                        let triggerDetails = firstTriggerFormData.triggerDetails ?? {};
                        setFirstTriggerFormData(firstTriggerFormData.updateTriggerDetails({...triggerDetails, 'from': event.target.checked}));
                    })}>From</Checkbox>
                </CheckboxGroup>
            </Center>

            <Button bgColor={'yellow'} fontFamily={'Langar'} fontSize={'1.5em'} margin={'10px'} onClick={_pullTheTrygger}>Pull the Trygger</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    {
                        !showConfirmLogin ?
                            <ModalBody margin={'10px'}>
                                <Box textAlign={'center'}>
                                    <Heading>Create Your Account</Heading>
                                    <br />
                                    <Text>You are creating a trygger.xyz account, which will allow you to manage all of your blockchain alerts.</Text>
                                    <br />
                                    <Text>{firstTriggerFormData.action === 'sms' ? 'We will send a one-time code to your phone number.'
                                        : 'We will email a one-time passwordless login link.'}</Text>
                                </Box>
                                <ModalFooter justifyContent={'space-between'}>
                                    <Button onClick={onClose}>Cancel</Button>
                                    <Button bgColor={'black'} textColor={'#FFFF00'} onClick={_handleCreateAccount}>{isLoading ? <Spinner /> : 'Create Account'}</Button>
                                </ModalFooter>
                            </ModalBody>
                        :
                            <ModalBody margin={'10px'}>
                                <Box textAlign={'center'}>
                                    <Heading>Confirm Account Creation</Heading>
                                    <br />
                                    <Text>{!isNewUser ? "It looks like you've already created an account." : ''} Please continue logging in.</Text>
                                    <br />
                                    <Text>{firstTriggerFormData.action === 'sms' ? 'Enter the one-time passcode we have just sent you'
                                        : 'Please check your email for a magical login link'}</Text>
                                    {
                                        firstTriggerFormData.action === 'sms' ?
                                        <Box>
                                            <br />
                                            <Input width={'150px'} value={phoneVerifyCode} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setPhoneVerifyCode(event.target.value);
                                                })}>
                                            </Input>
                                        </Box>
                                        : ''
                                    }
                                </Box>
                                <ModalFooter>
                                    <Button bgColor={'black'} textColor={'#FFFF00'} onClick={(async () => {
                                        let { session, error } = await supabase.auth.verifyOTP({
                                            phone: `+1${firstTriggerFormData.actionDetails['phoneNumber']}`,
                                            token: phoneVerifyCode,
                                        });
                                        console.log(`Verify Session: ${JSON.stringify(session)}\nError: ${JSON.stringify(error)}`);
                                    })}>Verify</Button>
                                </ModalFooter>
                            </ModalBody>
                    }
                </ModalContent>
            </Modal>
        </Box>
    );
}