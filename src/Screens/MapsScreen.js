import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, Modal, TouchableHighlight } from "react-native";
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

  const [isHelpModalVisible, setHelpModalVisible] = useState(false);

  const handleHelpPress = () => {
    setHelpModalVisible(true);
  };

  const closeModal = () => {
    setHelpModalVisible(false);
  };

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
                    Nomor gerbong: {prediction.carriageId}
                  </Text>
                  <Text>Tingkat keramaian: {prediction.crowd_level}</Text>
                  <Text>Jumlah orang: {prediction.person}</Text>
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
      
  
{/* Help Button */}
<View style={styles.helpButtonContainer}>
  <TouchableHighlight onPress={handleHelpPress} underlayColor="transparent">
    {/* Replace Text with Image */}
    <Image
      source={require('../../assets/helpbtn.png')} // Replace with the correct path to your vector image
      style={styles.helpButtonImage}
    />
  </TouchableHighlight>
</View>



{/* ... (rest of your existing code) */}

      {/* Help Modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={isHelpModalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Title */}
      <Text style={styles.modalTitle}>Kategori Tingkat Kearamaian</Text>

      {/* Content */}
      <Text style={styles.modalText}>
        0-30: Sepi, banyak tempat duduk yang kosong{"\n\n"}
        30-60: Cukup sepi, terdapat tempat duduk yang kosong{"\n\n"}
        60-120: Cukup padat, tidak ada tempat duduk, namun masih terdapat ruang yang cukup{"\n\n"}
        120-180: Padat, tidak ada tempat duduk, dan tidak banyak ruang{"\n\n"}
        180-250: Sangat padat, gerbong hampir penuh
      </Text>

      {/* Close Button */}
      <TouchableHighlight style={styles.modalCloseButton} onPress={closeModal}>
        <Text style={styles.modalCloseButtonText}>Close</Text>
      </TouchableHighlight>
    </View>
  </View>
</Modal>
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
  helpButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1001,
  },

  helpButtonImage: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
  },
  // Change the styles for helpButtonContainer
helpButtonContainer: {
  position: "absolute",
  bottom: 20, // Move it to the bottom
  right: 20,
  zIndex: 1001,
},

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },

  // Inside the styles object
modalText: {
  fontSize: 12, // You can adjust the font size as needed
  lineHeight: 18, // You can also adjust the line height for better readability
},

modalTitle: {
  fontSize: 16, // Adjust the font size as needed
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 10, // Adjust spacing as needed
},
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignSelf: "flex-end",
  },

  modalCloseButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default App;
