import React, { useContext, useState } from 'react';

const ConversationsContext = React.createContext();

function useConversationContext() {
    return useContext(ConversationsContext);
}

function ConversationProvider({children}) {
    const [conversations, setConversations] = useState([]);

    return(
        <ConversationsContext.Provider value={[conversations, setConversations]}>
            {children}
        </ConversationsContext.Provider>
    )
}

module.exports={ConversationProvider, useConversationContext}