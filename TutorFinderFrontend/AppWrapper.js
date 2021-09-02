import React from 'react';
import App from './App';
import {ConversationProvider} from './context/ConversationContext';

const Wrapper = () => {
    return(
        <ConversationProvider>
            <App/>
        </ConversationProvider>
    )
}

export default Wrapper;