import React,{useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getLatestLocation } from 'react-native-location';
//import RNLocation from 'react-native-location';





const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function MapScreen() {
const [currentLatitude, setcurrentLatitude] = useState('0');
const [currentLongitude, setcurrentLongitude] = useState('0');
const [watchID, setwatchID] = useState(0);

 async function requestLocationPermission() {
  console.log('requestLocationPermission');
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      alert('You can use the location');
      getLocation();
    } else {
      console.log('location permission denied');
      alert('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}


    const callLocation =()=>{
      console.log("CallLocation");
      if(Platform.OS ==='ios'){
        console.log('ios');
        getLocation();
      }else{
        console.log('android');
       requestLocationPermission();

      }
    }
const getLocation =()=>{
Geolocation.getCurrentPosition(
  (position)=>{
      const currentLatitude= JSON.stringify(position.coords.latitude);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      console.log(position);
      setcurrentLatitude(currentLatitude);
      setcurrentLongitude(currentLongitude);
      console.log('Latitude: ' + currentLatitude + ' Longitude: '+ currentLongitude);
  },
  (error)=>alert(error.message),
  {enableHighAccuracy:true,timeout:20000,maximumAge:2000}
);
const watchID=Geolocation.watchPosition((position)=>{
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        setcurrentLatitude(currentLatitude);
        setcurrentLongitude(currentLongitude);
});
setwatchID(watchID);
}
const clearLocation =()=>{
  console.log('ClearLocation');
  Geolocation.clearWatch(watchID);
}
    

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: 0.04,
            longitudeDelta: 0.05
          }}>
          <Marker
            coordinate={{
              latitude: parseFloat(currentLatitude),
              longitude: parseFloat(currentLongitude),
            }}/>
          
          
        </MapView>

        <Text>Latitude: {parseFloat(currentLatitude)}</Text>
        <Text>Longitude: {parseFloat(currentLongitude)}</Text>
        <Button title="Start" onPress={callLocation} />
        <Button title="Stop" onPress={clearLocation} />

      </View>
    );
  }




