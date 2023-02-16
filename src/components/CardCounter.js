import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default function CardCounter(props) {
    const {
        counter, 
        setCounter, 
        text,
        setText,
        imageLink, 
        title, 
        placeholder,
        withText,
        place
    } = props

    const styles = StyleSheet.create({
        container: {
          width: (place === 'Mall') ? 180: 140,
          height: (place === 'Mall') ? 180: 113,
          backgroundColor: '#ddd',
          alignItems: 'center',
        },
        title: {
          fontSize: (place === 'Mall') ? 30: 16,
          textAlign: 'center'
        },
        counter: {
          marginTop: 10,
          fontSize: (place === 'Mall') ? 30: 20
        },
        input: {
          height: 40,
          marginTop: 42,
          marginBottom: 12,
          marginRight: 24,
          marginleft: 12,
          borderWidth: 1,
          width: (place === 'Mall') ? 180: 140,
          padding: 10,
        },
        hidden: {
          // height: 40,
          marginLeft: 12,
          marginRight: 12,
          borderWidth: 0,
          width: 140,
          padding: 10,
        },
        cardContainer:{
            alignItems: (place === 'Mall') ? 'flex-start' : 'center',
        },
        inputContainer: {
            marginLeft: (place === 'Mall')? 0 : 24
        }
      });
      

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
   
    const increase = () => {
        setCounter(counter+1)
    }
  
    const onSwipe = (gestureName, gestureState) => {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

        switch (gestureName) {
          case SWIPE_DOWN:
            if (counter > 0) {
                setCounter(counter - 1);
            }
            
            break;
        }
      }

    return (
        <>
            <View style={styles.cardContainer}>
                <View style={styles.inputContainer}>
                    { withText ? (
                            <TextInput 
                                style={styles.input}
                                onChangeText={(e) => setText(e)}
                                value={text}
                                placeholder={placeholder}
                            />
                        ) : (
                            <View style={styles.hidden}></View>
                        )
                    }
                </View>

                <GestureRecognizer
                    onSwipe={(direction, state) => onSwipe(direction, state)}
                    config={config}
                    style={{
                        // flex: 1,
                        // backgroundColor: backgroundColor
                    }}
                >
                    <TouchableOpacity 
                        onPress={increase}
                    >
                        <View style={styles.container}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.counter}>{counter}</Text>
                        </View>
                    </TouchableOpacity>
                </GestureRecognizer>
            </View>
        </>
    );
}

