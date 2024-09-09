// our custom hook to fetch data from our two databases in Appwrite

import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'



const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)


    const fetchData = async () => {
        setIsLoading(true);

        try {

            const response = await fn();
            setData(response);

        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsLoading(false);
        }

    }


    // fetch videos as soon as component loads
    useEffect(() => {
        // we cannot make the function within useEffect parameter async, illegal syntax
        // we can only declare a new function within the function parameter for async actions
        fetchData();
    }, []);


    const refetch = () => fetchData();


    // return data as an object
    return {data, isLoading, refetch};
}

export default useAppwrite;


