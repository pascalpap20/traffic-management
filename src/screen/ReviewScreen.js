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

  useEffect(() => {
    console.log(route.params.ids)
  }, []);

  return (
    <View 
      style={{ 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    </View>
  );
}

