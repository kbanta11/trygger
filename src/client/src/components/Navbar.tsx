import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Box, Text, Link, Image, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, useDisclosure, 
    Heading, Select, InputGroup, Input, Button } from '@chakra-ui/react';
import { HashLink } from 'react-router-hash-link';
import logo from '../trygger.png';
import { userState } from '../atoms';
import { supabase } from '../services/supabaseClient';
import validator from 'validator';
import { LoginModal } from './LoginModal';

export const Navbar = () => {
    const [method, setMethod] = useState('sms');
    const [authVals, setAuthVals] = useState('');
    const [phoneVerifyCode, setPhoneVerifyCode] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useRecoilValue(userState);

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
                setShowVerify(showVerify);
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
                setShowVerify(showVerify);
            }
        }
    }

    return (
        <Box display={'flex'} justifyContent={'space-between'} padding={'10px'} alignItems={'center'}>
            <Image src={logo} height={'60px'} width={'240px'}/>
            <Box textColor={'white'}>
                {
                    user ? <Link margin={'5px'} onClick={(() => {supabase.auth.signOut()})}>Logout</Link> : <Link margin={'5px'} onClick={onOpen}>Login</Link> 
                }|
                <HashLink smooth to='/#use-cases'><span style={{margin: '5px'}}>Use Cases</span></HashLink>|
                <HashLink smooth to='/#pricing'><span style={{margin: '5px'}}>Pricing</span></HashLink>|
                <HashLink smooth to='/#about'><span style={{margin: '5px'}}>About</span></HashLink>|
                <HashLink smooth to='/#contact'><span style={{margin: '5px'}}>Contact</span></HashLink>
            </Box>
            <LoginModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}