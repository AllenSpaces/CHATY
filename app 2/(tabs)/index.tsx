import ChatView from '@/components/Chat';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1, paddingLeft: 15, paddingRight: 15}}>
      <ChatView />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({});
