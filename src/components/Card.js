import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Card({imageLink, title}) {
    const navigation = useNavigation();

    const navigate = () => {
        navigation.navigate('Place', { title });
    }

    

    return (
        <TouchableOpacity onPress={navigate}>
            <View style={styles.container}>
                <Image source={ imageLink == 'Stand Alone' ? require('../images/standalone.png') : require('../images/mall.png')}
                    style={{width: 200, height: 200}} />
                <Text>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
