import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const { width, height } = Dimensions.get("window"); // Pega as dimensões da tela
const cameraSize = width * 0.6; // Define um quadrado de 60% da largura da tela

export default function App() {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [ppfd, setPpfd] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const analyzeLight = async () => {
    if (!cameraRef.current) return Alert.alert("Câmera não disponível");

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo?.uri ?? '',
        [],
        { base64: true }
      );

      if (!manipulatedImage.base64) return Alert.alert("Erro ao processar a imagem.");

      const brightness = estimateBrightness(manipulatedImage.base64);
      setPpfd(brightness * 0.0185);

    } catch (error) {
      Alert.alert("Erro ao capturar a imagem");
    }
  };

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

  const handleLeftIconPress = () => {
    Alert.alert("Ícone esquerdo pressionado!");
    // Adicione aqui a ação desejada para o ícone esquerdo
  };

  const handleRightIconPress = () => {
    Alert.alert("Ícone direito pressionado!");
    // Adicione aqui a ação desejada para o ícone direito
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
      <ImageBackground
        source={require("./assets/fundo.png")} // Substitua pelo caminho correto
        style={styles.background}
        resizeMode="cover"
      >
        {/* Ícone no canto superior esquerdo */}
        <TouchableOpacity onPress={handleLeftIconPress} style={styles.leftIcon}>
          <Image
            source={require("./assets/Atencao.png")} // Caminho da imagem do ícone esquerdo
            style={styles.leftIconImage} // Estilo personalizado para o ícone esquerdo
          />
        </TouchableOpacity>

        {/* Ícone no canto superior direito */}
        <TouchableOpacity onPress={handleRightIconPress} style={styles.rightIcon}>
          <Image
            source={require("./assets/User.png")} // Caminho da imagem do ícone direito
            style={styles.rightIconImage} // Estilo personalizado para o ícone direito
          />
        </TouchableOpacity>

        {/* Conteúdo centralizado (câmera e texto PPFD) */}
        <View style={styles.content}>
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} ratio="1:1" />
          </View>
          <Text style={styles.text}>PPFD: {ppfd.toFixed(2)} µmol/m²/s</Text>
        </View>

        {/* Botão "Medir Luz" como ícone clicável */}
        <TouchableOpacity onPress={analyzeLight} style={styles.iconButton}>
          <Image
            source={require("./assets/Luz.png")} // Caminho da imagem do ícone
            style={styles.bottomIconImage} // Estilo personalizado para o ícone inferior
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cameraContainer: {
    width: cameraSize,
    height: cameraSize,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  iconButton: {
    position: "absolute", // Posiciona o ícone de forma absoluta
    bottom: 20, // Distância da parte inferior
    alignSelf: "center", // Centraliza horizontalmente
  },
  leftIcon: {
    position: "absolute", // Posiciona o ícone de forma absoluta
    top: 20, // Distância do topo
    left: 20, // Distância da esquerda
  },
  rightIcon: {
    position: "absolute", // Posiciona o ícone de forma absoluta
    top: 20, // Distância do topo
    right: 20, // Distância da direita
  },
  leftIconImage: {
    width: 90, // Largura do ícone esquerdo
    height: 40, // Altura do ícone esquerdo
    resizeMode: "contain", // Mantém a proporção da imagem
    // Cor personalizada para o ícone esquerdo
  },
  rightIconImage: {
    width: 90, // Largura do ícone direito
    height: 50, // Altura do ícone direito
    resizeMode: "contain", // Mantém a proporção da imagem
   // Cor personalizada para o ícone direito
  },
  bottomIconImage: {
    width: 80,
    height: 210,
    resizeMode: "contain",
  },
});