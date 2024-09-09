import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext();

    // rename returned data parameter as posts
    const {data: posts, refetch} = useAppwrite(getAllPosts);
    // use our custom hook to return the 7 newest posts instead of all the posts
    const {data: latestPosts} = useAppwrite(getLatestPosts);


    // when we drag down and page refreshes, we will fetch the newest data (videos)
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }



  return (
    <SafeAreaView className="bg-primary h-full">

        {/* We wrap a FlatList within an outer FlatList instead of TWO FlatLists inside ScrollView because 
            ScrollView does not support both horizontal and vertical scrolling together 
            FlatList is scrollable by default*/}
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
            <View className="my-6 px-4 space-y-6">
                <View className="justify-between items-start
                flex-row mb-6">
                    <View>
                        <Text className="font-pmediium text-sm text-gray-100">
                            Welcome back,
                        </Text>

                        <Text className="text-2xl font-psemibold text-white">
                            {user?.username}
                        </Text>
                    </View>

                    <View className="mt-1.5">
                        <Image 
                        source={images.logoSmall}
                        className="w-9 h-10"
                        resizeMode='contain'/>
                    </View>
                </View>


                <SearchInput/>


                <View className="w-full flex-1 pt-5 pb-8">
                    <Text className="text-gray-100 text-lg font-pregular mb-3">
                        Latest Videos
                    </Text>

                    <Trending 
                    // if posts is not provided make it an empty []
                    posts={latestPosts ?? []}/>
                </View>
            </View>
        )}

        // what to render if the data property is empty
        ListEmptyComponent={() => (
            <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
            />
        )}

        refreshControl={<RefreshControl 
        refreshing={refreshing}
        onRefresh={onRefresh}/>}
        />
    </SafeAreaView>
  )
}

export default Home