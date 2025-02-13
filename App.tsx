import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/login/login"; // Página de Login

const Stack = createStackNavigator();

function HomeScreen() {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [lux, setLux] = useState(0);
  const [ppfd, setPpfd] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  // Solicita permissão para a câmera ao iniciar o app
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // Captura uma foto e analisa o brilho da imagem
  const analyzeLight = async () => {
    if (!cameraRef.current) return Alert.alert("Câmera não disponível");

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      // Utilize a função correta para manipulação da imagem
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo?.uri ?? "",
        [],
        { base64: true }
      );

      if (!manipulatedImage.base64)
        return Alert.alert("Erro ao processar a imagem.");

      const brightness = estimateBrightness(manipulatedImage.base64);
      setLux(brightness);
      setPpfd(brightness * 0.0185); // Conversão aproximada de Lux → PPFD
    } catch (error) {
      Alert.alert("Erro ao capturar a imagem");
    }
  };

  // Estima a luminosidade média da imagem analisando os valores RGB
  const estimateBrightness = (base64Image: string): number => {
    let brightness = 0;
    let count = 0;

    for (let i = 0; i < base64Image.length; i += 4) {
      const r = base64Image.charCodeAt(i);
      const g = base64Image.charCodeAt(i + 1);
      const b = base64Image.charCodeAt(i + 2);
      brightness += (r + g + b) / 3;
      count++;
    }

    return brightness / count;
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de permissão para acessar a câmera.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Brilho estimado: {lux.toFixed(2)} Lux</Text>
      <Text>PPFD estimado: {ppfd.toFixed(2)}</Text>
      <CameraView ref={cameraRef} style={styles.camera} />
      <Button title="Analisar Luz" onPress={analyzeLight} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 300,
    height: 400,
  },
});
