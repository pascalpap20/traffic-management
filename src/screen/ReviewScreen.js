import { useEffect, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, Pressable } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

const db = openDatabase(
  {
    name: 'traffic',
    location:'default',
  }, 
  () => {},
  error => { console.log(error) }
);

export default function TrafficScreen({route}) {
  const navigation = useNavigation();
  
  const navigate = (title) => {
      navigation.navigate(title);
            
      setCountMotorcycleRun(0)
      setCountMotorcycleStop(0)
      setCountPeopleWalk(0)
      setCountPeopleStop(0)
      setPercentage(0)
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [countPeopleWalk, setCountPeopleWalk] = useState(0);
  const [countPeopleStop, setCountPeopleStop] = useState(0);
  const [countMotorcycleStop, setCountMotorcycleStop] = useState(0);
  const [countMotorcycleRun, setCountMotorcycleRun] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [competitors, setCompetitors] = useState([
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
    { name: '', price_range: '', tc: 0, turnover: '', tc2: 0, turnover2: '',},
  ]);

  const [pDay, setPDay] = useState('');
  const [pEnd, setPEnd] = useState('');
  const [p, setP] = useState('');
  const [turnoverWeekday, setTurnoverWeekday] = useState('');
  const [turnoverWeekend, setTurnoverWeekend] = useState('');
  const [turnoverDaily, setTurnoverDaily] = useState('');
  const [turnoverMonthly, setTurnoverMonthly] = useState('');
  const [literWeekday, setLiterWeekday] = useState('');
  const [literWeekend, setLiterWeekend] = useState('');
  const [literDaily, setLiterDaily] = useState('');
  const [literMonthly, setLiterMonthly] = useState('');

  const getData = () => {
    try {
      db.transaction(txn => {
        txn.executeSql(
        `SELECT * FROM places WHERE id IN (${route.params.ids.join(',')})`,
        [],
        (tx, results) => {
          const trafficData = [];

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              let record = results.rows.item(i)

              trafficData.push(record);
            }

            let motorcycleRun = trafficData.reduce(((acc, val) => acc + val.count_motorcycle_run), 0);
            let motorcycleStop = trafficData.reduce(((acc, val) => acc + val.count_motorcycle_stop), 0);
            let peopleWalk = trafficData.reduce(((acc, val) => acc + val.people_walk), 0);
            let peopleStop = trafficData.reduce(((acc, val) => acc + val.people_stop), 0);
            let percentage = peopleStop / peopleWalk * 100;
            percentage = parseFloat(percentage).toFixed(2);

            setCountMotorcycleRun(motorcycleRun);
            setCountMotorcycleStop(motorcycleStop);
            setCountPeopleWalk(peopleWalk);
            setCountPeopleStop(peopleStop);
            setPercentage(percentage);
          }

          setData(trafficData);
        },
        err => console.log(err)
      )
      });
    } catch (err) {
      console.log(err)
    }
  }

  const handleInputChange = (index, newValue, key) => {
    const newArray = [...competitors];
    newArray[index] = { ...newArray[index], [key]: newValue };
    setCompetitors(newArray);
  };

  const getReviewFeasibility = () => {
    // Total TC competitor
    let totalTCWeekday = competitors.reduce(((acc, val) => acc + Number(val.tc)), 0);
    let totalTCWeekend = competitors.reduce(((acc, val) => acc + Number(val.tc2)), 0);

    let estimatedWeekdayBuyer = totalTCWeekday * (percentage / 100);
    let estimatedWeekendBuyer = totalTCWeekend * (percentage / 100);
    let estimatedBuyer = countPeopleStop + countMotorcycleStop;
    let priceRangeBottom = 10000;
    let priceRangeTop = 20000;

    let estimatedWeekdayTurnover = estimatedWeekdayBuyer * priceRangeBottom;
    let estimatedWeekdayTurnover2 = estimatedWeekdayBuyer * priceRangeTop;
    let estimatedWeekendTurnover = estimatedWeekendBuyer * priceRangeBottom; 
    let estimatedWeekendTurnover2 = estimatedWeekendBuyer * priceRangeTop; 
    let estimatedDailyTurnover = estimatedBuyer * priceRangeBottom;
    let estimatedDailyTurnover2 = estimatedBuyer * priceRangeTop;
    let estimatedMonthlyTurnover = (route.params.place == 'Stand Alone') ? estimatedBuyer * priceRangeBottom * 30 : (((estimatedWeekdayBuyer * priceRangeBottom) * 22) + ((estimatedWeekendBuyer * priceRangeBottom) * 8));
    let estimatedMonthlyTurnover2 = (route.params.place == 'Stand Alone') ? estimatedBuyer * priceRangeTop * 30 : (((estimatedWeekdayBuyer * priceRangeTop) * 22) + ((estimatedWeekendBuyer * priceRangeTop) * 8));
    let estimatedWeekdayLiter = estimatedWeekdayBuyer * 0.2;
    let estimatedWeekdayLiter2 = estimatedWeekdayBuyer * 0.3;
    let estimatedWeekendLiter = estimatedWeekendBuyer * 0.2;
    let estimatedWeekendLiter2 = estimatedWeekendBuyer * 0.3;
    let estimatedDailyLiter = estimatedBuyer * 0.2
    let estimatedDailyLiter2 = estimatedBuyer * 0.3
    let estimatedMonthlyLiter = (route.params.place == 'Stand Alone') ? estimatedBuyer * 0.2 * 30 : ((estimatedWeekdayBuyer * 0.2) * 22) + ((estimatedWeekendBuyer * 0.2) * 0.8);
    let estimatedMonthlyLiter2 = (route.params.place == 'Stand Alone') ? estimatedBuyer * 0.3 * 30 : ((estimatedWeekdayBuyer * 0.3) * 22) + ((estimatedWeekendBuyer * 0.3) * 0.8);

    setPDay(`${estimatedWeekdayBuyer}`);
    setPEnd(`${estimatedWeekendBuyer}`);
    setP(`${estimatedBuyer}`);
    setTurnoverWeekday(`${parseFloat(estimatedWeekdayTurnover).toFixed(2)} - ${parseFloat(estimatedWeekdayTurnover2).toFixed(2)}`);
    setTurnoverWeekend(`${parseFloat(estimatedWeekendTurnover).toFixed(2)} - ${parseFloat(estimatedWeekendTurnover2).toFixed(2)}`);
    setTurnoverDaily(`${parseFloat(estimatedDailyTurnover).toFixed(2)} - ${parseFloat(estimatedDailyTurnover2).toFixed(2)}`);
    setTurnoverMonthly(`${parseFloat(estimatedMonthlyTurnover).toFixed(2)} - ${parseFloat(estimatedMonthlyTurnover2).toFixed(2)}`);
    setLiterWeekday(`${parseFloat(estimatedWeekdayLiter).toFixed(2)} - ${parseFloat(estimatedWeekdayLiter2).toFixed(2)}`);
    setLiterWeekend(`${parseFloat(estimatedWeekendLiter).toFixed(2)} - ${parseFloat(estimatedWeekendLiter2).toFixed(2)}`);
    setLiterDaily(`${parseFloat(estimatedDailyLiter).toFixed(2)} - ${parseFloat(estimatedDailyLiter2).toFixed(2)}`);
    setLiterMonthly(`${parseFloat(estimatedMonthlyLiter).toFixed(2)} - ${parseFloat(estimatedMonthlyLiter2).toFixed(2)}`);
  }

  const handleSave = () => {
    setModalVisible(true)
  }

  useEffect(() => {
    getData();
  }, []);

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      marginRight: 9,
      width: 53,
      height: 53,
      justifyContent: 'center', 
      borderRadius: 50,
      backgroundColor: '#FF1A1A'
    },
    input: {
      borderWidth: 1,
      width: 70,
      height: 35,
      marginRight: 5,
      marginBottom: 5,
    },
    textStyle: {
      fontSize: 13
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
    modalText: {
      marginBottom: 30,
      textAlign: "center",
      fontSize: 16,
      fontWeight: 'bold'
    },
    buttonYes: {
      backgroundColor: "#7AFF64",
    },
    buttonNo: {
      backgroundColor: "#FF6464",
    },
    buttonModal: {
      alignSelf: 'flex-end',
      marginRight: 9,
      width: 103,
      height: 53,
      justifyContent: 'center',
      borderRadius: 5
    },
    textStyleModal: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
  });

  return (
    <View 
      style={{ 
        flex: 1, 
        // alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
      }}
    >
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
                    style={[styles.buttonModal, styles.buttonYes]}
                    onPress={() => {
                      console.log('Ya')
                      setModalVisible(!modalVisible)
                    }}
                  >
                    <Text style={styles.textStyleModal}>Yes</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.buttonModal, styles.buttonNo]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyleModal}>No</Text>
                  </Pressable>
                </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <View 
        style={{
          flexDirection: 'column',
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 35
          }}
        >
          <Pressable
            style={[styles.button]}
            onPress={() => navigate('Traffic')}
          >
            <Text style={[styles.textStyle, { color: 'white' }]}>Back</Text>
          </Pressable>

          <View
            style={{
              width: '55%',
              height: 150,
              // backgroundColor: 'blue',
              borderStyle: 'dashed',
              borderColor: 'black',
              borderWidth: 1,
              justifyContent: 'center',
              // marginLeft: 45
            }}
          >
            {route.params.place == 'Stand Alone' &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between' 
                }}
              >
                <Text style={{
                    marginLeft: 10,
                    marginRight: 20
                  }}
                >Motor Jalan</Text>
                <Text style={{
                    marginRight: 20
                  }}
                >{countMotorcycleRun}</Text>
              </View>}

            {route.params.place == 'Stand Alone' &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between' 
                }}
              >
                <Text style={{
                    marginLeft: 10,
                    marginRight: 20
                  }}
                >Motor Berhenti</Text>
                <Text style={{
                    marginRight: 20
                  }}
                >{countMotorcycleStop}</Text>
              </View>}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginLeft: 10,
                  marginRight: 20
                }}
              >Orang Jalan</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countPeopleWalk}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginLeft: 10,
                  marginRight: 20
                }}
              >Orang Berhenti</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countPeopleStop}</Text>
            </View>

            {route.params.place == 'Mall' && 
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between' 
                }}
              >
                <Text style={{
                    marginLeft: 10,
                    marginRight: 20 
                  }}
                >Persentase</Text>
                <Text style={{
                    marginRight: 20
                  }}
                >{percentage}%</Text>
              </View>}
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          marginLeft: 5
          }}>
          <Text style={[styles.textStyle, { marginRight: 10}]}>Competitor</Text>
          <Text style={[styles.textStyle, { marginRight: 5}]}>Price Range</Text>
          <Text style={[styles.textStyle, { marginRight: 20}]}>TC</Text>
          <Text style={[styles.textStyle, { marginRight: 15}]}>Turnover</Text>
          <Text style={[styles.textStyle, { marginRight: 16}]}>TC</Text>
          <Text style={[styles.textStyle]}>Turnover</Text>
        </View>
        <ScrollView style={{
          width: 370,
          marginLeft: 5,
          flexGrow: 0,
          height: 170
        }}>
          {competitors.map((record, idx) => 
            <View 
              key={idx}
              style={{
                flexDirection: 'row',
              }}>
              <TextInput 
                  style={[styles.input]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'name')}
                  value={record.name}
                  // placeholder="Nama"
              />
              <TextInput 
                  style={[styles.input]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'price_range')}
                  value={record.price_range}
                  // placeholder="Range Harga"
              />
              <TextInput 
                  style={[styles.input, { width: 30 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'tc')}
                  value={record.tc}
                  // placeholder="TC"
                  keyboardType='number-pad'
              />
              <TextInput 
                  style={[styles.input, { width: 60 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'turnover')}
                  value={record.turnover}
                  // placeholder="Turnover"
              />
              <TextInput 
                  style={[styles.input, { width: 30 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'tc2')}
                  value={record.tc2}
                  // placeholder="TC"
                  keyboardType='number-pad'
              />
              <TextInput 
                  style={[styles.input, { width: 60 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'turnover2')}
                  value={record.turnover2}
                  // placeholder="Turnover"
              />
            </View>)}
        </ScrollView>
        
        <View style={{
          alignItems: 'flex-end',
          marginRight: 140,
          marginTop: 5
        }}>  
          <Pressable
            style={{ 
              width: 60,
              height: 30,
              backgroundColor: '#213A23',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
            onPress={() => getReviewFeasibility()}
          >
            <Text style={{ 
              color: 'white',
              textAlign: 'center',
              justifyContent: 'center',
              alignSelf: 'center' 
            }}>Update</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ 
        right: 100,
        bottom: 50,
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
        <Text>Review Feasibility</Text>
        <View
          style={{
            width: 340,
            // height: 200,  
            // backgroundColor: 'blue',
            borderStyle: 'dashed',
            borderColor: 'black',
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  marginTop: 10,
                  fontSize: 12
                }}
              >Estimasi Pembeli Weekday</Text>
              <Text style={{
                  marginRight: 5,
                  marginTop: 10,
                  fontSize: 9
                }}
              >{pDay}</Text>
            </View>}

          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Pembeli Weekend</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 9
                }}
              >{pEnd}</Text>
            </View>}

          {route.params.place == 'Stand Alone' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  marginTop: 10,
                  fontSize: 12
                }}
              >Estimasi Pembeli</Text>
              <Text style={{
                  marginRight: 5,
                  marginTop: 10,
                  fontSize: 12
                }}
              >{p}</Text>
            </View>}
            
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between' 
            }}
          >
            <Text style={{
                marginRight: 20,
                marginLeft: 10,
                fontSize: 12
              }}
            >Range Harga</Text>
            <Text style={{
                marginRight: 5,
                fontSize: 12
              }}
            >10.000 - 20.000</Text>
          </View>

          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Omset Weekday</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{turnoverWeekday}</Text>
            </View>}

          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Omset Weekend</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{turnoverWeekend}</Text>
            </View>}

          {route.params.place == 'Stand Alone' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Omseet Harian</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{turnoverDaily}</Text>
            </View>}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between' 
            }}
          >
            <Text style={{
                marginRight: 20,
                marginLeft: 10,
                fontSize: 12
              }}
            >Estimasi Omset Bulanan</Text>
            <Text style={{
                marginRight: 5,
                fontSize: 12
              }}
            >{turnoverMonthly}</Text>
          </View>

          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Liter Weekday</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{literWeekday}</Text>
            </View>}

          {route.params.place == 'Mall' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Liter Weekend</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{literWeekend}</Text>
            </View>}

          {route.params.place == 'Stand Alone' &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between' 
              }}
            >
              <Text style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontSize: 12
                }}
              >Estimasi Liter Harian</Text>
              <Text style={{
                  marginRight: 5,
                  fontSize: 12
                }}
              >{literDaily}</Text>
            </View>}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between' 
            }}
          >
            <Text style={{
                marginRight: 20,
                marginLeft: 10,
                marginBottom: 10,
                fontSize: 12
              }}
            >Estimasi Liter Bulanan</Text>
            <Text style={{
                marginRight: 5,
                marginBottom: 10,
                fontSize: 12
              }}
            >{literMonthly}</Text>
          </View>
        </View>
        
        <View style={{
          alignItems: 'flex-end',
          // marginRight: 140,
          marginTop: 5
        }}>  
          <Pressable
            style={{ 
              width: 60,
              height: 30,
              backgroundColor: '#213A23',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
            onPress={() => handleSave()}
          >
            <Text style={{ 
              color: 'white',
              textAlign: 'center',
              justifyContent: 'center',
              alignSelf: 'center' 
            }}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

