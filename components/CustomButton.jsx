import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

// we destructure the props object into each parameter
const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7} //when we press the button
    className={`bg-secondary rounded-xl min-h-[80px] 
    justify-center items-center ${containerStyles} 
    ${isLoading ? 'opacity-50' : ''}`}
    disabled={isLoading}>

        <Text className={`font-psemibold text-lg
        ${textStyles}`}
        style={{color: '#F8ECDC'}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton