import { createContext, ReactNode, useState, useEffect} from "react";

import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession();

interface UserProps{
    name: string;
    avatarURL: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthProviderProps){

    const [user,setUser] = useState<UserProps>({} as UserProps)

    const [isUserLoading, setisUserLoading] = useState(false);


    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '141303319230-b9e0pqqha3gp22j1b78opli9iaff870v.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({useProxy:true}),
        scopes: ['profile', 'email']
    });


    async function signIn() {
        try {
            setisUserLoading(true)
            await promptAsync();
        } catch (error) {
            console.log(error)
            throw error;
        }finally{
            setisUserLoading(false)
        }
    }

    async function singInWithGoogle(access_Token: string) {
        console.log("TOKEN DE AUTENTICAÇÃO => ", access_Token )
    }

    useEffect(() =>{
        if(response?.type === 'success' && response.authentication?.accessToken){
            singInWithGoogle(response.authentication.accessToken)
        }
    },[response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>

        {children}
        </AuthContext.Provider>

    )

}