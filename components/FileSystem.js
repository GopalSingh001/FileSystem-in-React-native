import React, { useState, useEffect } from 'react';

import { View, Text, Button, StyleSheet, Platform, TouchableHighlight } from 'react-native';

import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing'



const FileSystem1 = () => {

  const downloadFromURL = async () => {
    const fileName = 'small.mp4';
    const result = await FileSystem.downloadAsync(
      'http://techslides.com/demos/sample-videos/small.mp4',
      FileSystem.documentDirectory + fileName

    );
    console.log(result)
    save(result.uri, fileName, result.headers['Content-Type'])
  }

  const downloadFromAPI = async () => {
    const fileName = 'MissCoding.pdf';
    const localhost = Platform.OS === 'android' ? '192.168.29.66' : '127.0.0.1';
    const result = await FileSystem.downloadAsync(
      `http://${localhost}:19000/generate-pdf?name=MissCoding&email=hello@tripwiretech.com`,
      FileSystem.documentDirectory + fileName, {
      headers: {
        "MyHeader": "MyValue"
      }
    }
    );
    console.log(result)
    save(result.uri, fileName, result.headers['Content-Type'])
  }

  const save = async (uri, fileName, mimetype) => {
    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 })

          })
          .catch(e => console.log(e))
      }
      else {
        shareAsync(uri)
      }
    }
    else {
      shareAsync(uri)
    }
  }


  return (
    <View style={Styles.Container}>
      <Text style={Styles.Text}>Please Download The file</Text>
      <Text style={Styles.Button1} onPress={downloadFromURL}>Download From URL</Text>
      <Text style={Styles.Button2} onPress={downloadFromAPI} >
        Download from API
      </Text>

    </View>

  );
}

const Styles = StyleSheet.create({
  Container: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Text:
  {
    color: 'red',
    marginBottom: 20,
    backgroundColor: 'pink',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20

  },

  Button1: {
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
    fontSize: 20,
    color: 'white'
  },
  Button2: {
    backgroundColor: 'grey',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
    fontSize: 20,
    color: 'white'
  }


})

export default FileSystem1;
