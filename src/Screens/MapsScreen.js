import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Client } from "react-native-paho-mqtt";
// import SvgUri from "react-native-svg-uri"; // Import SvgUri from react-native-svg-uri
import customMarkerImage from "../../assets/train.png";

const initialMaps = {
  latitude: -6.363338,
  longitude: 106.82484,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

const mqttClientOptions = {
  uri: "ws://35.239.90.168:8083/mqtt",
  clientId: "mqttx_f31296e1",
  keepalive: 60,
  clean: true,
  storage: myStorage,
  userName: "client",
  password: "TranseatsClient2023",
};

const App = () => {
  const [region, setRegion] = useState(initialMaps);
  const [markerData, setMarkerData] = useState(null);
  const [mqttClient, setMqttClient] = useState(null);
  const [desc, setDesc] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const renderInfoWindow = () => {
    return (
      <View style={styles.infoWindow}>
        <Text>{desc}</Text>
      </View>
    );
  };


  useEffect(() => {
    const client = new Client(mqttClientOptions);
    setMqttClient(client);

    client.onConnectionLost = (responseObject) => {
      console.log("Connection lost:", responseObject);
    };

    client.connect(mqttClientOptions).then(() => {
      console.log("Connected");
      client.subscribe("Data");
    });

    client.on("messageReceived", (message) => {
      console.log("Message arrived:", message);
      const jsonMessage = JSON.parse(message.payloadString);
      console.log("Message:", jsonMessage);
      setMarkerData(jsonMessage);
      setRegion({
        ...region,
        latitude: parseFloat(jsonMessage.latitude),
        longitude: parseFloat(jsonMessage.longitude),
      });
    });

    const generateDescription = () => {
      let description = "";
      if (markerData && markerData.prediction) {
        for (let i = 0; i < markerData.prediction.length; i++) {
          description += `Carriage ID: ${markerData.prediction[i].carriageId}, Crowd Level: ${markerData.prediction[i].crowd_level}, No. of Person: ${markerData.prediction[i].person}\n`;
        }
      }
      setDesc(description);
    };

    if (markerData) {
      generateDescription();
    }

    return () => {
      if (client.isConnected()) {
      }
    };

  }, [region, mqttClientOptions, markerData]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
      >
        {markerData ? (
          <Marker
            coordinate={{
              latitude: parseFloat(markerData.latitude),
              longitude: parseFloat(markerData.longitude),
            }}
            title={"Train 1"}
          >
            <Callout>
              {markerData.prediction.map((prediction) => (
                <View style={{ padding: 10 }} key={prediction.carriageId}>
                  <Text style={{ fontWeight: "bold" }}>
                    Carriage ID: {prediction.carriageId}
                  </Text>
                  <Text>Crowd Level: {prediction.crowd_level}</Text>
                  <Text>No. of Person: {prediction.person}</Text>
                </View>
              ))}
            </Callout>
          </Marker>
        ) : (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Default Title"
          ></Marker>
        )}
      </MapView>
      {showInfoWindow && renderInfoWindow()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoWindow: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    zIndex: 1000, // Ensure the info window is above the map
  },
});

export default App;
