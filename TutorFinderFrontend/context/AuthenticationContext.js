import * as React from 'react';

let AuthenticationContext = React.createContext();

let initialState = {
    access_token: '',
    refresh_token: ''
}

let reducer = (state, action) => {
    switch(action.type) {
        case 'access_token':
            return {access_token: action.payload};
        case 'refresh_token':
            return {refresh_token: action.payload};
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
          }
    }
}

function AuthenticationContextProvider({children}) {
    let [state, dispatch] = React.useReducer(reducer, initialState);
    let value = {state, dispatch};
    return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}

function useAuthenticationContext() {
    const context = React.useContext(AuthenticationContext)
    if (context === undefined) {
        throw new Error('useAuthenticationContext must be used within a AuthenticationContextProvider')
    }
    return context
}

export {AuthenticationContextProvider, useAuthenticationContext}