import { useEffect, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
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
  }

  const [header, setHeader] = useState(['Kategori', 'Lokasi', 'Jam', 'Motor Jalan', 'Motor Berhenti', 'Orang Jalan', 'Orang Berhenti']);
  const [data, setData] = useState([]);
  const [widthArr, setWidthArr] = useState([100, 100, 100, 100, 100, 100, 100]);

  const getTrafficData = ()  => {
    try {
      db.transaction(txn => {
        txn.executeSql(
        `SELECT * FROM places`,
        [],
        (tx, results) => {
          const trafficData = [];

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              let record = [
                results.rows.item(i).category,
                results.rows.item(i).location,
                results.rows.item(i).time,
                results.rows.item(i).count_motorcycle_run,
                results.rows.item(i).count_motorcycle_stop,
                results.rows.item(i).people_walk,
                results.rows.item(i).people_stop,
                results.rows.item(i).id,
              ]

              trafficData.push(record);
            }
          }
          setData(trafficData)
        },
        err => console.log(err)
      )
      });
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getTrafficData();
  }, []);

  const element = (cellData, index, records) => (
    <View style={{ flexDirection: 'row' }}>
      <Text>{cellData}</Text>
      <TouchableOpacity onPress={() => {console.log(records[index][7])}}>
        <View style={{ width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 }}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>button</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View 
      style={{ 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View 
        style={{
          flexDirection: 'row',
          marginBottom: 10
        }}
      >
        <View style={{
          marginRight: 582
        }}>
            <Button 
              title='Back'
              color={'#FF1A1A'}
              onPress={() => navigate('Home')}
              />
        </View>
        <View>
            <Button 
              title='Review'
              color={'#213A23'}
              onPress={() => navigate('Review')}
              />
        </View>
      </View>

      <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row data={header} widthArr={widthArr}/>
            </Table>

            <ScrollView style={{ marginTop: -1}}>
              <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                {
                data.map((rowData, index) => (
                  <TableWrapper key={index} style={{ flexDirection: 'row', backgroundColor: '#FFF1C1' }}>
                    {
                      rowData
                        .filter((data, idx) => idx !== 7) // Hilangin kolom idnya
                        .map((cellData, cellIndex, records) => (
                          <Cell key={cellIndex} data={(cellIndex === 6) ? element(cellData, index, data) : cellData} style={{ width: 100}}/>
                      ))
                    }
                  </TableWrapper>
                ))
                }
              </Table>
            </ScrollView>
          </View>
      </ScrollView>
    </View>
  );
}

