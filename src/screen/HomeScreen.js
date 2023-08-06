import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Card from '../components/Card';

export default function HomeScreen({ }) {
  const navigation = useNavigation();
  
  const navigate = (title) => {
      navigation.navigate(title);
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerButton}>
        <View style={{marginRight: 10}}>
          <Button 
            title='Data Traffic'
            color={'#213A23'}
            onPress={() => navigate('Traffic')}
          />
        </View>
        <View style={{marginRight: 150}}>
          <Button 
            title='Hasil Survey'
            color={'#213A23'}
            onPress={() => navigate('Survey')}
          />
        </View>
        <View>
          <Button 
            title='BEP'
            color={'#213A23'}
            onPress={() => navigate('Bep')}
            />
        </View>
      </View>

      <View style={styles.containerCard}>
        <Card imageLink={'Mall'} title={'Mall'} navigation/>
        <Card imageLink={'Stand Alone'} title={'Stand Alone'} navigation/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerButton: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginRight: 190,
    marginTop: 50
  }
});
