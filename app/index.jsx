import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import {Link, Redirect, router} from 'expo-router'
import {SafeAreaView} from 'react-native-safe-area-context'
import {images} from '../constants'
import CustomButton from '../components/CustomButton.jsx';
import { useGlobalContext } from '../context/GlobalProvider';
import LogoFlipWithBubble from '../components/LogoFlipWithBubble.jsx'


export default function App() {



    const {isLoading, isLoggedIn} = useGlobalContext();


    if (!isLoading && isLoggedIn) return <Redirect href="/home"/>


  return (
    //<View style={styles.container}>

    <SafeAreaView className='bg-primary h-full'>
        {/* for smaller devices they might need to scroll to see full content */}
        <ScrollView contentContainerStyle={{height: '100%'}}>
            <View className='w-full justify-center items-center min-h-[85vh] px-4'>

                <LogoFlipWithBubble/>

                <View className='relative mt-5'>
                    <Text className='text-5xl text-white font-bold text-center mt-10'>
                        TIDALLY 
                    </Text>
                </View>


                <CustomButton
                title="Sign-in with Google"
                handlePress={() => router.push('/sign-in')}
                containerStyles={'w-full mt-14'}/>
            </View>
        </ScrollView>

        {/* make the top of phone with battery and time and notifications bar visible */}
        <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}
