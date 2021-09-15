import React from 'react';
import App from './App';
import {ConversationProvider} from './context/ConversationContext';
import {AccountContextProvider} from './context/AccountContext';

const Wrapper = () => {
    return(
        <ConversationProvider>
            <AccountContextProvider>
                <App/>
            </AccountContextProvider>
        </ConversationProvider>
    )
}

export default Wrapper;