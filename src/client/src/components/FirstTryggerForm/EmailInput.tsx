
import React from 'react';
import { Heading, Input,Box } from '@chakra-ui/react';
import { useRecoilState } from 'recoil'
import { firstTriggerFormState } from '../../atoms';

export const EmailInput = () => {
    const [firstTriggerFormData, setFirstTriggerFormData] = useRecoilState(firstTriggerFormState);

    return (
        <Box>
            <Heading fontSize={'1.5em'} marginTop={'10px'} marginBottom={'5px'}>Email</Heading>
            <Input value={firstTriggerFormData.actionDetails ? firstTriggerFormData.actionDetails['email'] ?? '' : ''} onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
                let actionDetails = firstTriggerFormData.actionDetails ?? {};
                setFirstTriggerFormData(firstTriggerFormData.updateActionDetails({...actionDetails, 'email': event.target.value}));
            })}></Input>
        </Box>
    );
}