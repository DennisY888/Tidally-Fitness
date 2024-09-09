// (tabs) is a route group, all files within share a common layout

import { View, Text, Image } from 'react-native'
import React from 'react'
import {Tabs, Redirect} from 'expo-router'

// importing icons.jsx
import {icons} from '../../constants'


// create a new component
const TabIcon = ({icon, color, name, focused}) => {
    return (
        // just like div
        <View className='items-center justify-center gap-2'>
            <Image 
            source={icon}
            resizeMode='contain'
            tintColor={color}
            className='w-6 h-6'
            />

            <Text 
            className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
            style={{color: color}}>
                {name}
            </Text>
        </View>
    )
}




const TabsLayout = () => {
  return (
    <>
        <Tabs screenOptions={{
            // this gets rid of the default label, so we use our own title
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#FFA001',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
                backgroundColor: '#161622', // primary color
                borderTopWidth: 1,
                borderTopColor: '#232533',
                height: 84,
            }
        }}>
            <Tabs.Screen
                name='home' //the filename/tab
                options={{
                    title: 'Home',
                    headerShown: false,
                    // takes a functions that returns a component which renders an icon
                    // color and focused are given 
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon
                        icon={icons.home}
                        color={color}
                        name="Home"
                        focused={focused}/>
                    )
                }}
            />

{/*
            <Tabs.Screen
                name='bookmark' //the filename/tab
                options={{
                    title: 'Bookmark',
                    headerShown: false,
                    // takes a functions that returns a component which renders an icon
                    // color and focused are given 
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon
                        icon={icons.bookmark}
                        color={color}
                        name="Bookmark"
                        focused={focused}/>
                    )
                }}
            />
*/}


            <Tabs.Screen
                name='create' //the filename/tab
                options={{
                    title: 'Create',
                    headerShown: false,
                    // takes a functions that returns a component which renders an icon
                    // color and focused are given 
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon
                        icon={icons.plus}
                        color={color}
                        name="Create"
                        focused={focused}/>
                    )
                }}
            />


            <Tabs.Screen
                name='profile' //the filename/tab
                options={{
                    title: 'Profile',
                    headerShown: false,
                    // takes a functions that returns a component which renders an icon
                    // color and focused are given 
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="Profile"
                        focused={focused}/>
                    )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout
