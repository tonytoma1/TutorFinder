import React, {useContext, useState} from 'react'

const SocketContext = React.createContext();

function useSocketContext() {
    return useContext(SocketContext);
}

function SocketContextProvider({children}) {
    const [socket, setSocket] = useState(null);

    return (
        <SocketContext.Provider value={[socket, setSocket]}>
            {children}
        </SocketContext.Provider>
    )
}

module.exports={useSocketContext, SocketContextProvider}