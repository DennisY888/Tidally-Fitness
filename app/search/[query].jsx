import { View, Text, FlatList} from 'react-native'
import React, {useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {

    const {query} = useLocalSearchParams();
    const {data: posts, refetch} = useAppwrite(() => searchPosts(query));


    // instead of scrolling down to refresh,
    // we refresh everytime query changes
    useEffect(() => {
        refetch()
    }, [query])



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
            <View className="my-6 px-4">
                <Text className="font-pmediium text-sm text-gray-100">
                    Search Results
                </Text>

                <Text className="text-2xl font-psemibold text-white">
                    {query}
                </Text>

                <View className="mt-6 mb-8">
                    {/* this will pre-populate the search bar if we come from home */}
                    <SearchInput initialQuery={query}/>
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

export default Search