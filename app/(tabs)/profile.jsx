// DELETE ************* NOT USED

import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native'
import React, {useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import {router} from 'expo-router'

const Profile = () => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext();
    const {data: posts, refetch} = useAppwrite(() => getUserPosts(user.$id));


    const logout = async () => {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);

      // cannot go back by swiping, we have replaced the profile url instead of pushing a new url for sign in
      router.replace('/sign-in')
    }



  return (
    <SafeAreaView className="bg-primary h-full">

        {/* We wrap a FlatList within an outer FlatList instead of TWO FlatLists inside ScrollView because 
            ScrollView does not support both horizontal and vertical scrolling together 
            FlatList is scrollable by default */}
        <FlatList
        // an array
        data={posts}
        // provide each item with a unique key
        keyExtractor={(item) => item.$id}
        // how to render each item
        // body of our page
        renderItem={({item}) => (
            <VideoCard 
            video={item}
            />
        )}
        ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
              >
                <Image
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"/>
              </TouchableOpacity>


              <View className="w-16 h-16 border border-secondary rounded-lg
              justify-center items-center">
                <Image
                // user?.avatar is a safe way to perform user.avatar, 
                // if user is null/undefined then it just returns undefined instead throwing an error
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
                />
              </View>


              <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
              />

              <View className="mt-5 flex-row">
                <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
                />

                {/* this is for followers, FAKE followers */}
                <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
                />
              </View>
            </View>
        )}

        // what to render if the data property is empty
        ListEmptyComponent={() => (
            <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
            />
        )}
        />
    </SafeAreaView>
  )
}

export default Profile
