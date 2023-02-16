import { useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

import CardCounter from '../components/CardCounter';

export default function PlaceScreen({route}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [countPeopleWalk, setCountPeopleWalk] = useState(0);
  const [countPeopleStop, setCountPeopleStop] = useState(0);
  const [countMotorcycleStop, setCountMotorcycleStop] = useState(0);
  const [countMotorcycleRun, setCountMotorcycleRun] = useState(0);
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      // justifyContent: 'center',
    },
    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
      width: (route.params.title === 'Mall') ? 393 : 360
    },
    button: {
      alignSelf: 'flex-end',
      marginRight: 9,
      width: 103,
      height: 53,
      justifyContent: 'center',
      borderRadius: 5
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // marginTop: 22,   
      backgroundColor: 'rgba(0,0,0, 0.7)',
    },
    modalView: {
      // margin: 20,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 50,
      opacity: 1,
      // width: 403,
      // height: 207,
      alignItems: "center",
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      // elevation: 5
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonYes: {
      backgroundColor: "#7AFF64",
    },
    buttonNo: {
      backgroundColor: "#FF6464",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
    modalText: {
      marginBottom: 30,
      textAlign: "center",
      fontSize: 16,
      fontWeight: 'bold'
    }
  });

  return (
    <View style={styles.container}>
      {/* <Text>{route.params.title}</Text> */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(!modalVisible)}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Yakin data yang diinput sudah benar?</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Pressable
                    style={[styles.button, styles.buttonYes]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Yes</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonNo]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>No</Text>
                  </Pressable>
                </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
        <View>
          <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row'}}>
              {(route.params.title === 'Stand Alone') ? ( 
                  <>
                    <CardCounter 
                      counter={countMotorcycleRun} 
                      setCounter={setCountMotorcycleRun} 
                      text={location}
                      setText={setLocation}
                      imageLink={'https://reactjs.org/logo-og.png'} 
                      title={'Motor\nJalan'} 
                      placeholder={'Location'}
                      withText={true}
                      place={route.params.title}
                />
                    
                    <CardCounter 
                      counter={countMotorcycleStop} 
                      setCounter={setCountMotorcycleStop} 
                      text={time}
                      setText={setTime}
                      imageLink={'https://reactjs.org/logo-og.png'} 
                      title={'Motor\nBerhenti'} 
                      placeholder={'Time'}
                      withText={true}
                      place={route.params.title}
                    />
                  </>
                ) : (
                  ''
                )}
            </View>
            
            <View style={{ flexDirection: 'row'}}>
              <CardCounter 
                counter={countPeopleWalk} 
                setCounter={setCountPeopleWalk} 
                text={location}
                setText={setLocation}
                imageLink={'https://reactjs.org/logo-og.png'} 
                title={'Orang\nJalan'} 
                placeholder={'Location'}
                withText={(route.params.title === 'Stand Alone') ? false : true}
                place={route.params.title}
              /> 
              
              <CardCounter 
                counter={countPeopleStop} 
                setCounter={setCountPeopleStop}  
                text={time}
                setText={setTime}
                imageLink={'https://reactjs.org/logo-og.png'} 
                title={'Orang\nBerhenti'} 
                placeholder={'Time'}
                withText={(route.params.title === 'Stand Alone') ? false : true}
                place={route.params.title}
              /> 
              </View>
          </View>

          <View style={styles.button}>
            <Button 
              title='Next'
              color={'#213A23'}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>
    </View>
  );
}


