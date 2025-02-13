import React from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";

const { width, height } = Dimensions.get("window");

export default function InfoBox({ navigation }: any) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                <Image
                    source={require("../../assets/Seta.png")}
                    style={styles.backIcon}
                />
            </TouchableOpacity>
            <Text style={styles.functionalityText}>Funcionalidade</Text>
            <Text style={styles.text}>
                Este aplicativo mede a intensidade da luz capturada pela câmera do dispositivo, estimando o brilho em lux e convertendo para PPFD (Fluxo de Fótons Fotossintéticos). Além disso, ele analisa os valores de RGB (Vermelho, Verde e Azul) da imagem para calcular a luminosidade média, proporcionando uma estimativa precisa da luz disponível para o crescimento das plantas.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 20,
        backgroundColor: "#D8D8D8",
        width: "100%",
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
        width: 100,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        elevation: 10,
        backgroundColor: "transparent",
    },
    backIcon: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    functionalityText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
        marginTop: 20,
        marginBottom: 10,
        textAlign: "left",
        width: "100%",
    },
    text: {
        fontSize: 18,
        color: "#493224",
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "left",
        width: "100%",
    },
});
