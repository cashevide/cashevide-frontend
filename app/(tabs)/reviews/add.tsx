import { View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Column } from '@/src/components/layout/Column';
import { Row } from '@/src/components/layout/Row';
import { Center } from '@/src/components/layout/Center';

const Box = ({ color, text }: { color: string, text: string }) => (
  <View className={`h-20 w-20 justify-center items-center rounded-xl m-2 ${color}`}>
    <Text className="text-white font-bold text-2xl">{text}</Text>
  </View>
);


export default function AddPage() {
  return (
    <Center>
      <Center className='flex-1 w-1/2 bg-background'>
        <Column justify='around' items='center' className='h-full'>
          <Box color='bg-red-500' text='1' />
          <Box color='bg-blue-500' text='2' />
          <Box color='bg-green-500' text='3' />
        </Column>
      </Center>
    </Center>
  );
}
