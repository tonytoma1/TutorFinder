import React from 'react';
import App from './App';
import {ConversationProvider} from './context/ConversationContext';
import {AccountContextProvider} from './context/AccountContext';
import {SocketContextProvider} from './context/SocketContext';

const Wrapper = () => {
    return(
        <ConversationProvider>
            <AccountContextProvider>
                <SocketContextProvider>
                <App/>
                </SocketContextProvider>
            </AccountContextProvider>
        </ConversationProvider>
    )
}

export default Wrapper;