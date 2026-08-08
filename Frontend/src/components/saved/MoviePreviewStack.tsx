import { Image, Text, View } from "react-native";

type Props = {
  posters: string[];
  remaining?: number;
};

const MoviePreviewStack = ({ posters, remaining = 0 }: Props) => {
  return (
    <View className={`flex-row items-center justify-start overflow-hidden w-full ${posters.length > 0 ? 'h-32' : 'h-0'}`}>
      {posters.slice(0, 3).map((poster) => (
        <Image
          key={poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500/${poster}` }}
          className="mr-2 w-[23%] h-full rounded-xl"
          resizeMode="cover"
        />
      ))}
      {remaining > 0 && (
        <View className=" h-full w-[23%] items-center justify-center rounded-xl relative">
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${posters[3]}` }}
            className="w-full h-full rounded-xl z-0"
            resizeMode="cover"
          />
          <View className="absolute h-full w-full flex justify-center items-center top-0 bg-black/50 z-10">
            <Text className="text-white text-2xl font-bold">{remaining}+</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MoviePreviewStack;
