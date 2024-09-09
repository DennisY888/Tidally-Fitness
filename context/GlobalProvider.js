// provides us with all the states we need
//*** REMEMBERS user has logged in and does not prompt auth pages again after reloading app */
import {createContext, useContext, useEffect, useState} from 'react'
import { getCurrentUser } from '../lib/appwrite';


// creates a context object, stores states values in returned component
const GlobalContext = createContext();

// this hook allows components to access context data
// instead of calling useContext(GlobalContext) directly
export const useGlobalContext = () => useContext(GlobalContext);


const GlobalProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // executes once at the beginning
    useEffect(() => {

        // this gives us our current user data, which is then stored in global context
        // we can then decide what to do with this user in index.jsx (automatically log the user in)
        getCurrentUser()
        .then((res) => {
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, []);


    
    return (
        // in order for this context to be global it has to WRAP all the screens in our application
        <GlobalContext.Provider
        value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading
        }}>
            {/* all our components in between, used in _layout.jsx */}
            {children}
        </GlobalContext.Provider>
    )
}



export default GlobalProvider;