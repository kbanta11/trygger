import React from 'react';
import { Center, Box, SimpleGrid, Image, Heading, Text, Divider, Table, Tbody, Tr, Td, Button, useDisclosure } from '@chakra-ui/react';
import { FirstTryggerForm } from '../FirstTryggerForm/FirstTryggerForm';
import whale from '../../assets/whale.png';
import wallet from '../../assets/wallet.png';
import block from '../../assets/block.png';
import { ContactForm } from '../ContactForm';
import { BiCheckCircle } from 'react-icons/bi';
import { LoginModal } from '../LoginModal';
import { GoProModal } from './GoProModal';

export const Home = () => {
    const { isOpen: basicIsOpen, onOpen: basicOnOpen, onClose: basicOnClose } = useDisclosure();
    const { isOpen: proIsOpen, onOpen: proOnOpen, onClose: proOnClose } = useDisclosure();

    return (
        <Center flexDirection={'column'}>
            <Box display={''}>
                <FirstTryggerForm />
            </Box>
            <Box margin={['10px 15px 25px 25px', '10px 15px 25px 25px','10px']}>
                <Heading id='use-cases' fontSize={'3em'} fontFamily={'Langar'} textColor='#FFFF00' marginTop={'20px'} marginBottom={'20px'}>Use Cases</Heading>
                <Box display={'flex'} marginBottom={'10px'}>
                    <SimpleGrid columns={[1, 1, 3]} spacing={'18px'}>
                        <Box bgColor={'white'} borderRadius={'15px'} paddingTop={'20px'} paddingBottom={'20px'} paddingLeft={'20px'} paddingRight={'14px'} boxShadow={'-12px 12px 0px -0px #C4C4C4'}>
                            <Center><Image src={whale} height={'85px'}/></Center>
                            <Heading marginTop={'16px'} fontSize={'1.5em'} textColor={'black'}>Be The First To Know When a <span style={{color: '#64C3A3'}}>Whale</span> Wakes Up</Heading>
                            <Text marginTop={'16px'} textColor={'black'}>The movements of whale wallets are critical to keep on eye on in crypto. They have the ability to move markets, and their influence on social media makes it even more important to know early what whales are doing. Use our curated list of important whale and influencer wallets, or add your own.</Text>
                        </Box>
                        <Box bgColor={'white'} borderRadius={'15px'} paddingTop={'20px'} paddingBottom={'20px'} paddingLeft={'20px'} paddingRight={'14px'} boxShadow={'-12px 12px 0px -0px #C4C4C4'}>
                            <Center>
                                <Image src={wallet} height={'85px'} />
                            </Center>
                            <Heading marginTop={'16px'} fontSize={'1.5em'} textColor={'black'}>Monitor Your Wallets for <span style={{color: '#FF5C5C'}}>Sketchy</span> Activity</Heading>
                            <Text marginTop={'16px'} textColor={'black'}>Having your wallet hacked is one of the biggest fears for most of us in crypto. It’s a nightmare many of us have had that we wake up one morning, check our wallet just to recognize it’s been drained by signing a malicious contract. If we had known right away, we could have saved our ass(ets). And that’s what Trygger is for!</Text>
                        </Box> 
                        <Box bgColor={'white'} borderRadius={'15px'} paddingTop={'20px'} paddingBottom={'20px'} paddingLeft={'20px'} paddingRight={'14px'} boxShadow={'-12px 12px 0px -0px #C4C4C4'}>
                            <Center>
                                <Image src={block}  height={'85px'}/>    
                            </Center>
                            <Heading marginTop={'16px'} fontSize={'1.5em'} textColor={'black'}>Get Notified on <span style={{color: '#2C73FF'}}>Smart Contract Events</span> like NFT Sales</Heading>
                            <Text marginTop={'16px'} textColor={'black'}>We wouldn’t have a complete picture of what’s happening on the blockchain if we were only looking at transactions. You’ll be able to setup smart contract event Tryggers such as NFT Transfers, ERC-20 Transfers to a certain address, or your own custom event alerts for any custom smart contract event!</Text>
                        </Box>    
                    </SimpleGrid>
                </Box>
                <Heading id='pricing' fontSize={'3em'} fontFamily={'Langar'} textColor='#FFFF00' marginTop={'30px'} marginBottom={'20px'}>Pricing</Heading>
                <Center>
                    <Box margin={'10px 10px 10px 10px'} width={['100%', '100%', '80%', '60%']}>
                        <SimpleGrid columns={[1, 1, 2]} spacing={'20px'}>
                        <Box bgColor={'white'} borderRadius={'15px'} paddingTop={'10px'} paddingBottom={'6px'} paddingLeft={'8px'} paddingRight={'5px'} boxShadow={'-12px 12px 0px -0px #C4C4C4'}>
                                <Heading fontSize={'1.5em'} marginBottom={'16px'} textColor={'black'}>Basic</Heading>
                                <Heading display={'inline'} bgColor={'yellow'} borderRadius={'10px'} padding={'5px 15px 0px 15px'} fontFamily={'Langar'}><span style={{fontSize: 12, verticalAlign: 'top'}}>$</span>FREE 99</Heading>
                                <Divider height={'15px'}/>
                                <Table>
                                    <Tbody>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Up to 3 Tryggers</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>SMS and Email Alerts</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Wallet Monitoring</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>ERC20 and NFT Token Alerts</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='grey' size={'24px'}/></Td>
                                            <Td><Text textColor={'grey'} marginLeft={'15px'}>Whale Wallet Watch</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='grey' size={'24px'}/></Td>
                                            <Td><Text textColor={'grey'} marginLeft={'15px'}>Custom Smart Contract Event Alerts</Text></Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                                <Button bgColor={'#FFFF00'} margin={'15px 10px 15px 10px'} fontFamily={'Langar'} fontSize={'1.2em'} onClick={basicOnOpen}>Try Now!</Button>
                                <LoginModal isOpen={basicIsOpen} onClose={basicOnClose} />
                            </Box>
                            <Box bgColor={'white'} borderRadius={'15px'} paddingTop={'10px'} paddingBottom={'6px'} paddingLeft={'8px'} paddingRight={'5px'} boxShadow={'-12px 12px 0px -0px #C4C4C4'}>
                                <Heading fontSize={'1.5em'} marginBottom={'16px'} textColor={'black'}>Pro</Heading>
                                <Heading display={'inline'} bgColor={'yellow'} borderRadius={'10px'} padding={'5px 15px 0px 15px'} fontFamily={'Langar'}><span style={{fontSize: 12, verticalAlign: 'top'}}>$</span>8.99</Heading>
                                <Divider height={'15px'}/>
                                <Table>
                                    <Tbody>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Unlimited Tryggers</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>SMS and Email Alerts</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Wallet Monitoring</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>ERC20 and NFT Token Alerts</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Whale Wallet Watch</Text></Td>
                                        </Tr>
                                        <Tr>
                                            <Td><BiCheckCircle color='green' size={'24px'}/></Td>
                                            <Td><Text marginLeft={'15px'}>Custom Smart Contract Event Alerts</Text></Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                                <Button bgColor={'#FFFF00'} margin={'15px 10px 15px 10px'}fontFamily={'Langar'} fontSize={'1.2em'} onClick={proOnOpen}>Go Pro!</Button>
                                <GoProModal isOpen={proIsOpen} onClose={proOnClose} />
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Center>
                <Heading id='about' fontSize={'3em'} fontFamily={'Langar'} textColor='#FFFF00' marginTop={'30px'} marginBottom={'20px'}>About</Heading>
                <Text textColor={'white'}>Trygger is a new blockchain alerting and monitoring platform that allows users to always be in the know with what's happening on chain and not miss out or be caught off guard in this extremely fast moving space. With Trygger, you can set alerts to receive texts or emails (with more platforms coming soon) whenever a transaction happens that meets your criteria. You can set an alert on your wallet addresses so that you always know if your wallet is moving when it shouldn't be. Or set an alert on a whale wallet to be the first to know what moves they're making. With the explosion of NFTs recently, you might even want to set some alerts on NFT events, like new purchases by a whale, or to watch the action on a specific project. You can also track ERC20 token transactions and receive alerts when certain moves are made (say you want to be notified any time more than 10 billion SHIB are moved in a transaction, or any time your friend buys a new ERC20 token). Knowing, and knowing early, can be the difference between massive wins and massive losses on the blockchain. Never be out of the know with Trygger.
                <br />
                <br />
                Trygger started in Spring 2022 as a personal project to fill a need that I had for myself (to watch my wallets and to receive text alerts on smart contract events). After realizing that there wasn't much out there, especially geared to smart contract events (most everything is geared towards price alerts), I decided that it was something that I could, and should, build. And so I did, and the result is Trygger. It's kept me in the loop with the NFT world without suffering from the overstimulation of constantly checking Discord. It's given me peace of mind that my wallet keys are secure and that I'll be the first to know if my wallet is being drained (and hopefully have time to recover it). And it's given me the ability to know when to pull the Trygger at the right moments. 
                </Text>
                <Heading id='contact' fontSize={'3em'} fontFamily={'Langar'} textColor='#FFFF00' marginTop={'30px'} marginBottom={'20px'}>Contact</Heading>
                <ContactForm />
            </Box>
        </Center>
    );
}