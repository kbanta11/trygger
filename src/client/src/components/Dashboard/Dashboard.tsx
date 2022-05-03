import React, { useEffect } from 'react';
import { Box, SimpleGrid, Button, useDisclosure } from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, tryggerListState } from '../../atoms';
import { Helpers } from '../../services/dbHelpers';
import { TryggerCard } from './TryggerCard';
import { NewTryggerModal } from '../NewTrygger/NewTryggerModal';

export const Dashboard = () => {
    const user = useRecoilValue(userState);
    const [tryggers, setTryggers] = useRecoilState(tryggerListState);//useState([] as any[]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getTryggers = async () => {
        let userTryggers = await Helpers.getTryggers(user!.id);
        setTryggers(userTryggers);
    }

    const checkCanCreate = async () => {
        let u = await Helpers.getUserData(user!.id);
        if(u) {
            //check if user can create
            console.log(`User: ${JSON.stringify(u)}\nTryggers: ${tryggers.length}`);
            if(u.tier !== 'pro' && tryggers.length >= 3) {
                return false;
            }
            return true;
        }
        return false;
    }

    useEffect(() => {
        //get supabase triggers
        getTryggers();
    }, [isOpen])
    return (
        <Box textColor={'white'} paddingTop={'24px'} paddingBottom={'20px'} paddingLeft={['15px', '15px', '10px']} paddingRight={['15px', '15px', '10px']}>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={'10px'}>
                {
                    tryggers.map((t) => {
                        return (
                            <TryggerCard trygger={t} />
                        );
                    })
                }
                <Box textAlign={'start'}>
                    <Button fontSize={'2em'} textColor={'black'} padding={'5px 5px 10px 5px'} onClick={( async () => {
                        let canCreate = await checkCanCreate();
                        if(canCreate) {
                            onOpen();
                        } else {
                            alert('You must be a Trygger Pro member to create more than 3 Tryggers!');   
                        }
                    })}>+</Button>
                </Box>    
            </SimpleGrid>
            <NewTryggerModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}