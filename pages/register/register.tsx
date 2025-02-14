import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from "react-native";
import axios from "axios";

// Pega as dimensões da tela
const { width, height } = Dimensions.get('window');

export default function Register({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://localhost:5000/register", {
                username: email,
                password: password
            });

            if (response.status === 201) {
                Alert.alert("Registro bem-sucedido");
                navigation.replace("Login");
            } else {
                Alert.alert("Erro ao registrar, tente novamente");
            }
        } catch (error: any) {
            Alert.alert("Erro ao registrar, verifique suas informações");
        }
    };
    return (
        <View style={styles.containerMain}>
            <View style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.title}>Registrar</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome de usuário:"
                            placeholderTextColor="#493224"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Senha:"
                            placeholderTextColor="#493224"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Registrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace("Login")}>
                        <Text style={styles.loginButtonText}>Já tem uma conta? Faça login</Text>
                    </TouchableOpacity>


                </View>
            </View>

            <View style={styles.containerImage}>
                <ImageBackground style={styles.image} resizeMode="contain" source={require("../../assets/bg-login-novo.png")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#D8D8D8",
        width: "100%",
    },
    loginButton: {
        marginTop: 10,
        backgroundColor: "#9EB735", // Cor de fundo verde
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },

    loginButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff", // Texto branco para contraste
    },
    containerImage: {
        position: "absolute", // Faz com que a imagem tenha um posicionamento absoluto
        bottom: 0, // Fixa a imagem na parte inferior
        right: 0, // Fixa a imagem no lado direito
        width: '100%', // Ajuste o tamanho conforme necessário
        height: 500, // Ajuste o tamanho conforme necessário
    },
    image: {
        width: "100%", // Ajusta a largura da imagem para a largura do container
        height: "100%", // Ajusta a altura da imagem para a altura do container
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", // Faz com que o fundo ocupe toda a tela
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    container: {
        width: width * 0.9,
        maxWidth: 400,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        minHeight: height * 0.5,
    },
    title: {
        fontSize: width < 375 ? 24 : 30,
        fontWeight: "bold",
        color: "#493224",
        marginBottom: 40,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 45,
        borderColor: "#9EB735",
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 16,
        color: "#9EB735",
    },
    button: {
        width: "100%",
        height: 45,
        borderRadius: 10,
        backgroundColor: "#9EB735",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});
