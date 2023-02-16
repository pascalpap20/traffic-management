import { StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Card imageLink={'https://reactjs.org/logo-og.png'} title={'Mall'} navigation/>
      <Card imageLink={'https://reactjs.org/logo-og.png'} title={'Stand Alone'} navigation/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
