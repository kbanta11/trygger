import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { sessionState, userState } from './atoms';
import './App.css';
import { Box, Center } from '@chakra-ui/react';
import { Navbar } from './components/Navbar';
import { Home } from './components/home/Home';
import { supabase } from './services/supabaseClient';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [, setSession] = useRecoilState(sessionState);

  useEffect(() => {
    //check if there is an active session
    const _session = supabase.auth.session();
    //console.log('Session: %s', _session);
    //set session/user recoil variable
    setSession(_session);
    setUser(_session?.user ?? null);
    //listen for auth state changes and update state variables
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, _ses) => {
      setSession(_ses);
      setUser(_ses?.user ?? null);
      //console.log('Auth State Changed. User: %s', JSON.stringify(_ses?.user));
    });

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  return (
    <Router>
      <Center backgroundColor={'#282c34'} alignItems={'start'} minWidth={'100vw'} minHeight={'100vh'} >
        <Box width={['100%', '100%', '80%']} textAlign={'center'}>
          <Navbar />
          <Routes>
            <Route path='/' element={user ? <Dashboard /> : <Home />} />
          </Routes>
        </Box>
      </Center>
    </Router>
  );
}

export default App;
