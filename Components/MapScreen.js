import React,{useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image,
  Dimensions
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getLatestLocation } from 'react-native-location';
//import RNLocation from 'react-native-location';

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.004; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  map: {
    height: '85%',
    width: '100%',

  },
  main: {
    padding: 0,
    backgroundColor:"white",
    display: 'flex',
  },
  Buttons: {},
});

export default function MapScreen() {
const [currentLatitude, setcurrentLatitude] = useState('0');
const [currentLongitude, setcurrentLongitude] = useState('0');
const [watchID, setwatchID] = useState(0);
const [Start, setStart] = useState(false);
const [ButtonColor, setButtonColor] = useState("green");
const [ButtonTitle, setButtonTitle] = useState("Start")
 async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getLocation();
    } else {
      alert('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}


    const callLocation =()=>{
      console.log("CallLocation");
      if(Platform.OS ==='ios'){
        getLocation();
      }else{
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
const  HandleStart=()=>{
  

if (Start===false){
  callLocation();
  setButtonColor("red");
  setButtonTitle("STOP");
}
  else{
    clearLocation();
    setButtonColor('green');
    setButtonTitle('START');
  }
setStart(!Start);
}
    

    return (
      <View style={styles.main}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: parseFloat(currentLatitude),
              longitude: parseFloat(currentLongitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
            <Marker
              coordinate={{
                latitude: parseFloat(currentLatitude),
                longitude: parseFloat(currentLongitude),
              }}
            />
          </MapView>
        </View>
        <View>
          <Text>{Start.toString()}</Text>
          <Text>Latitude: {parseFloat(currentLatitude)}</Text>
          <Text>Longitude: {parseFloat(currentLongitude)}</Text>
        </View>
        <View>
          <Button
            style={styles.Buttons}
             title={ButtonTitle}
            onPress={HandleStart}
            color={ButtonColor}
          />
        </View>
      </View>
    );
  }




