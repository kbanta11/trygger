import React, { useState } from 'react';
import validator from 'validator';
import { Box, Center, Heading, Button, Input, Textarea, Text } from '@chakra-ui/react';
import { Helpers } from '../services/dbHelpers';

export const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sentSuccess, setSentSuccess] = useState(false);

    const _sendMessage = async () => {
        if(!validator.isEmail(email)) {
            alert('Please enter a valid email address!');
            return;
        }

        let result = await Helpers.sendContactForm({name: name, email: email, message: message});
        if(result) {
            setSentSuccess(true);
        } else {
            alert('We\'re sorry, we had trouble sending your contact information. Please try again or feel free to email us at contact@trygger.xyz');
        }
    }

    return (
        <Center>
            {
                sentSuccess ?
                <Box flexDirection={'column'} width={['100%', '100%', '80%', '60%']} margin={'15px 0px 15px 0px'}>
                    <Text textColor={'white'}>Thank you for your message! We'll get back to you ASAP!</Text>    
                </Box>
                :
                <Box flexDirection={'column'} width={['100%', '100%', '80%', '60%']}>
                    <Heading fontSize={'1.25em'} textColor={'white'} margin={'15px 0px 15px 0px'}>Name</Heading>
                    <Input textColor={'white'} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {setName(event.target.value)})}></Input>
                    <Heading fontSize={'1.25em'} textColor={'white'} margin={'15px 0px 15px 0px'}>Email</Heading>
                    <Input textColor={'white'} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value)})}></Input>
                    <Heading fontSize={'1.25em'} textColor={'white'} margin={'15px 0px 15px 0px'}>Message</Heading>
                    <Textarea textColor={'white'} size={'sm'} rows={10} onChange={((event: React.ChangeEvent<HTMLTextAreaElement>) => {setMessage(event.target.value)})}></Textarea>
                    <Button margin={'20px 0px 15px 0px'} fontFamily={'Langar'} bgColor={'#FFFF00'} fontSize={'1.2em'} onClick={_sendMessage}>Send Message</Button>
                </Box>
            }
        </Center>
    );
}