import { View, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '../../../constants/icons'

const SearchBar = ({ onPress, placeholder, value, onChangeText }: { onPress: () => void; placeholder: string; value?: string; onChangeText?: (text: string) => void }) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} className="size-5" resizeMode='contain' tintColor="#AB8BFF" />
      <TextInput
        placeholder={placeholder}
        onPressIn={onPress}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#AB8BFF"
        className="text-white placeholder:ml-4 w-full"
      />
    </View>
  )
}

export default SearchBar