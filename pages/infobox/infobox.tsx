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
            <Text style={styles.functionalityText}>Funcionalidade</Text> {/* Alterado */}
            <Text style={styles.text}>
                Este aplicativo mede a intensidade da luz capturada pela câmera do dispositivo, estimando o brilho em lux e convertendo para PPFD (Fluxo de Fótons Fotossintéticos). Além disso, ele analisa os valores de RGB (Vermelho, Verde e Azul) da imagem para calcular a luminosidade média, proporcionando uma estimativa precisa da luz disponível para o crescimento das plantas.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",  // Centraliza verticalmente
        alignItems: "flex-start",  // Alinha o conteúdo à esquerda
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
        zIndex: 10, // Garante que fique acima de outros elementos
        elevation: 10, // Para Android
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
        marginTop: 20,  // Ajuste para mover mais para cima
        marginBottom: 10,
        textAlign: "left",  // Alinha o texto à esquerda
        width: "100%", // Garante que o texto ocupe toda a largura da tela
    },
    text: {
        fontSize: 18,
        color: "#493224",
        fontWeight: "bold",
        marginTop: 20,  // Para evitar sobreposição com o texto de funcionalidade
        textAlign: "left",  // Alinha o texto à esquerda
        width: "100%", // Garante que o texto ocupe toda a largura da tela
    },
});