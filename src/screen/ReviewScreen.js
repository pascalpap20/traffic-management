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

  const [data, setData] = useState([]);
  const [countPeopleWalk, setCountPeopleWalk] = useState(0);
  const [countPeopleStop, setCountPeopleStop] = useState(0);
  const [countMotorcycleStop, setCountMotorcycleStop] = useState(0);
  const [countMotorcycleRun, setCountMotorcycleRun] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [competitors, setCompetitors] = useState([
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
    { name: '', price_range: '', tc: '', turnover: '', tc2: '', turnover2: '',},
  ]);

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
    let estimatedWeekdayBuyer
    let estimatedWeekendBuyer
    let estimatedBuyer
    let priceRange
    let estimatedWeekdayTurnover
    let estimatedWeekendTurnover
    let estimatedDailyTurnover
    let estimatedMonthlyTurnover
    let estimatedWeekdayLiter
    let estimatedWeekendLiter
    let estimatedDailyLiter
    let estimatedMonthlyLiter

    console.log(competitors)
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
    }
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
            <Text style={styles.textStyle}>Back</Text>
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
                  placeholder="Nama"
              />
              <TextInput 
                  style={[styles.input]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'price_range')}
                  value={record.price_range}
                  placeholder="Range Harga"
              />
              <TextInput 
                  style={[styles.input, { width: 30 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'tc')}
                  value={record.tc}
                  placeholder="TC"
                  keyboardType='number-pad'
              />
              <TextInput 
                  style={[styles.input, { width: 60 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'turnover')}
                  value={record.turnover}
                  placeholder="Turnover"
              />
              <TextInput 
                  style={[styles.input, { width: 30 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'tc2')}
                  value={record.tc2}
                  placeholder="TC"
                  keyboardType='number-pad'
              />
              <TextInput 
                  style={[styles.input, { width: 60 }]}
                  onChangeText={(newValue) => handleInputChange(idx, newValue, 'turnover2')}
                  value={record.turnover2}
                  placeholder="Turnover"
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
            width: 300,
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
                  marginTop: 10
                }}
              >Estimasi Pembeli Weekday</Text>
              <Text style={{
                  marginRight: 20,
                  marginTop: 10
                }}
              >{countMotorcycleRun}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Pembeli Weekend</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countMotorcycleStop}</Text>
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
                  marginTop: 10
                }}
              >Estimasi Pembeli</Text>
              <Text style={{
                  marginRight: 20,
                  marginTop: 10
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
                marginRight: 20,
                marginLeft: 10
              }}
            >Range Harga</Text>
            <Text style={{
                marginRight: 20
              }}
            >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Omset Weekday</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Omset Weekend</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Omseet Harian</Text>
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
                marginRight: 20,
                marginLeft: 10
              }}
            >Estimasi Omset Bulanan</Text>
            <Text style={{
                marginRight: 20
              }}
            >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Liter Weekday</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Liter Weekend</Text>
              <Text style={{
                  marginRight: 20
                }}
              >{countMotorcycleStop}</Text>
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
                  marginLeft: 10
                }}
              >Estimasi Liter Harian</Text>
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
                marginRight: 20,
                marginLeft: 10,
                marginBottom: 10
              }}
            >Estimasi Liter Bulanan</Text>
            <Text style={{
                marginRight: 20,
                marginBottom: 10
              }}
            >{countMotorcycleStop}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

