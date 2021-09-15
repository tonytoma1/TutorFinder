import React, {useContext, useState} from 'react';

const AccountContext = React.createContext();

function useAccountContext() {
    return useContext(AccountContext);
}


function AccountContextProvider({children}) {
    const [account, setAccount] = useState([]);

    return(
        <AccountContext.Provider value={[account, setAccount]}>
            {children}
        </AccountContext.Provider>
    )
}

module.exports = {useAccountContext, AccountContextProvider}