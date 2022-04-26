
import React from 'react';
import { Heading, Input,Box, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { useRecoilState } from 'recoil'
import { firstTriggerFormState } from '../../atoms';

export const PhoneInput = () => {
    const [firstTriggerFormData, setFirstTriggerFormData] = useRecoilState(firstTriggerFormState);

    return (
        <Box>
            <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Phone Number</Heading>
            <InputGroup>
                <InputLeftAddon>+1</InputLeftAddon>
                <Input value={firstTriggerFormData.actionDetails ? firstTriggerFormData.actionDetails['phoneNumber'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                    let actionDetails = firstTriggerFormData.actionDetails ?? {};
                    setFirstTriggerFormData(firstTriggerFormData.updateActionDetails({...actionDetails, 'phoneNumber': event.target.value}));
                })}></Input>
            </InputGroup>
        </Box>
    );
}