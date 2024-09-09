// DELETE *************** NOT USEDDDDD


import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, {useState} from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import {Video, ResizeMode} from 'expo-av'


const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
}


const zoomOut = {
    0: {
        scale: 1.1
    },
    1: {
        scale: 0.9
    }
}



// activeItem is the key/id, item is the actual document
const TrendingItem = ({activeItem, item}) => {

    const [play, setPlay] = useState(false);

    return (
        // a view that allows us to do animations in it
        <Animatable.View
        className="mr-5"
        // pass in a javascript object
        animation={activeItem === item.$id ? zoomIn : zoomOut}
        // 500ms
        duration={500}
        >
            {play ? (
                // this is from expo-av, which allows us to play video
                <Video 
                source={{uri: item.video}}
                className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                onLoadStart={() => {  
                    console.log("Video loading started");
                  }}
                onLoad={() => { 
                    console.log("Video loaded successfully");
                  }}
                onError={(error) => { 
                    console.error("Video Error:", error);
                  }}
                onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                        setPlay(false);
                    }
                }}
                />
            ) : (
                <TouchableOpacity
                className="relative justify-center items-center"
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
                >
                    <ImageBackground 
                    source={{uri: item.thumbnail}}
                    className="w-52 h-72 rounded-[35px] my-5
                    overflow-hidden shadow-lg shadow-black/40"
                    resizeMode='cover'
                    />

                    <Image
                    source={icons.play}
                    className="w-12 h-12 absolute"
                    resizeMode='contain'
                    />
                </TouchableOpacity>
            )}

        </Animatable.View>
    )
}



const Trending = ({posts}) => {

    // set activeItem to the first post that we passed in
    const [activeItem, setActiveItem] = useState(posts[0]);


    // the parameter is given by the FlatList property
    const viewableItemsChanged = ({viewableItems}) => {
        // if there are current viewable items
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }
    }

  return (
    <FlatList
    data={posts}
    horizontal
    keyExtractor={(item) => item.$id}
    renderItem={({item}) => (
        <TrendingItem 
        activeItem={activeItem}
        item={item}
        />
    )}
    // this automatically decides which element is currently viewable on screen, WOWWW
    onViewableItemsChanged={viewableItemsChanged}
    viewabilityConfig={{
        itemVisiblePercentThreshold: 70
    }}
    // when to apply that visibility percentage
    contentOffset={{x: 170}}
    />
  )
}

export default Trending