import React, { useState } from "react";

const AuthenticationContext = React.createContext();

export function useAuthenticationContext() {
    return React.useContext(AuthenticationContext);
}


export function AuthenticationProvider({children}) {
    const [authentication, setAuthentication] = useState({refreshToken: '', accessToken: '', signedIn: false});

    // TODO check if jwt tokens exists in storage

    return (
        <AuthenticationContext.Provider value={authentication}>
            {children}
        </AuthenticationContext.Provider>
    )
}