import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function App() {
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
        photo?.uri ?? '', // URI da imagem
        [], // Nenhuma manipulação de imagem aqui, mas você pode adicionar transformações como redimensionamento ou rotação
        { base64: true }
      );

      if (!manipulatedImage.base64) return Alert.alert("Erro ao processar a imagem.");

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
      <CameraView ref={cameraRef} style={styles.camera} />
      <Button title="Medir Luz" onPress={analyzeLight} />
      <Text>Lux estimado: {lux.toFixed(2)}</Text>
      <Text>PPFD estimado: {ppfd.toFixed(2)} µmol/m²/s</Text>
    </View>
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