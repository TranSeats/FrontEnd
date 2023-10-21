import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Client } from "react-native-paho-mqtt";

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
  clientId: "mqttx_75679296",
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

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, [region, mqttClientOptions]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
      >
        {markerData && (
          <Marker
            coordinate={{
              latitude: parseFloat(markerData.latitude),
              longitude: parseFloat(markerData.longitude),
            }}
            title={markerData.Pesan}
            description={`Crowd Level: ${markerData.crowd_level}`}
          />
        )}
      </MapView>
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
});

export default App;
