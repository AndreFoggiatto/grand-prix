import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ImageBackground, 
  Dimensions, 
  Image 
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const { width, height } = Dimensions.get("window");
const cameraSize = width * 0.6;
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/login/login"; // Página de Login
import Register from './pages/register/register' // Paginna de cadastro

const Stack = createStackNavigator();

function HomeScreen() {
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
        photo?.uri ?? "",
        [],
        { base64: true }
      );

      if (!manipulatedImage.base64)
        return Alert.alert("Erro ao processar a imagem.");

      const brightness = estimateBrightness(manipulatedImage.base64);
      setPpfd(brightness * 0.0185); // Conversão aproximada de Lux → PPFD
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
  };

  const handleRightIconPress = () => {
    Alert.alert("Ícone direito pressionado!");
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
        source={require("./assets/fundo.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={handleLeftIconPress} style={styles.leftIcon}>
          <Image
            source={require("./assets/Atencao.png")}
            style={styles.leftIconImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRightIconPress} style={styles.rightIcon}>
          <Image
            source={require("./assets/User.png")}
            style={styles.rightIconImage}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} ratio="1:1" />
          </View>
          <Text style={styles.text}>PPFD: {ppfd.toFixed(2)} µmol/m²/s</Text>
        </View>

        <TouchableOpacity onPress={analyzeLight} style={styles.iconButton}>
          <Image
            source={require("./assets/Luz.png")}
            style={styles.bottomIconImage}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  leftIcon: {
    position: "absolute",
    top: 20,
    left: 10,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    position: "absolute",
    top: 20,
    right: 10,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
  },
  leftIconImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  rightIconImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  bottomIconImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
