import React, { useState } from 'react';
import validator from 'validator'; 
import { Modal, ModalOverlay, ModalContent, ModalBody,
    Heading, InputGroup, Input, Select, ModalFooter, Button, Text, Box} from '@chakra-ui/react';
import { supabase } from '../services/supabaseClient';


export const LoginModal = (props: any) => {
    const [showVerify, setShowVerify] = useState(false);
    const [method, setMethod] = useState('sms');
    const [authVals, setAuthVals] = useState('');
    const [phoneVerifyCode, setPhoneVerifyCode] = useState('');

    async function _signIn() {
        if(method === 'sms') {
            if(!(validator.isMobilePhone(authVals, 'en-US'))) {
                alert('Invalid Phone Number');
                return;
            }

            var { user, error } = await supabase.auth.signIn({
                phone: authVals
            });
            if(!error) {
                setShowVerify(true);
            }
        } else {
            if(!(validator.isEmail(authVals))) {
                alert('Invalid Email');
                return;
            }

            var { user, error } = await supabase.auth.signIn({
                email: authVals
            });
            if(!error) {
                setShowVerify(true);
            }  
        }
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
                <ModalOverlay />
                
                    {
                        !showVerify ? 
                        <ModalContent>
                            <ModalBody textAlign={'center'}>
                                <Heading fontFamily={'Langar'}>Log In</Heading>
                                <Heading fontSize={'1.2em'} marginTop={'10px'} marginBottom={'10px'}>Sign-In Method</Heading>
                                <Select value={method} onChange={((event: React.ChangeEvent<HTMLSelectElement>) => {
                                    setMethod(event.target.value);
                                })}>
                                    <option value='sms'>Phone Number</option>
                                    <option value='email'>Email</option>
                                </Select>
                                <InputGroup marginTop={'10px'} marginBottom={'10px'} flexDirection={'column'}>
                                    <Heading fontSize={'1.2em'} marginBottom={'10px'}>{method === 'sms' ? 'Phone Number' : 'Email'}</Heading>
                                    <Input value={authVals} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                        setAuthVals(event.target.value);
                                    })}></Input>
                                </InputGroup>
                                <Text marginBottom={'10px'}>If you do not already have an account, we will create one for you!</Text>
                            </ModalBody>
                            <ModalFooter justifyContent={'space-between'}>
                                <Button onClick={props.onClose}>Cancel</Button>
                                <Button bgColor={'black'} textColor={'yellow'} onClick={_signIn}>Log In</Button>
                            </ModalFooter>
                        </ModalContent>
                        :
                        <ModalContent>
                            <ModalBody textAlign={'center'}>
                                <Heading fontFamily={'Langar'}>Log In</Heading>
                                {
                                    method === 'sms' ? 
                                    <Box>
                                        <Text>Enter your verification code</Text>
                                        <Input width={'150px'} value={phoneVerifyCode} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                                                setPhoneVerifyCode(event.target.value);
                                            })}>
                                        </Input>
                                    </Box>
                                    :
                                    <Text marginBottom={'10px'}>Please check your email for a login link!</Text>
                                }
                            </ModalBody>
                            <ModalFooter justifyContent={'space-between'}>
                                <Button onClick={(() => {setShowVerify(false)})}>Back</Button>
                                {
                                    method === 'sms' ?
                                    <Button bgColor={'black'} textColor={'yellow'} onClick={(async () => {
                                        console.log(`Verifying with values: ${authVals} / Token: ${phoneVerifyCode}`);
                                        var { session, error } = await supabase.auth.verifyOTP({phone: authVals, token: phoneVerifyCode});
                                        if(!error) {
                                            props.onClose();
                                        } else {
                                            console.log(error)
                                        }
                                    })}>Verify</Button>
                                    : ''
                                }
                            </ModalFooter>
                        </ModalContent>
                    }
                
            </Modal>
    );
}