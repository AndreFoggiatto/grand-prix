import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/login", {
                username: email,
                password: password
            });

            if (response.status === 200) {
                // Exibe mensagem de sucesso e navega para a próxima tela
                Alert.alert("Login bem-sucedido");
                // Aqui você pode salvar o token em um armazenamento seguro (AsyncStorage, SecureStore, etc.)
                const userId = response.data.user_id;
                console.log("User id recebido:", userId);
                await AsyncStorage.setItem("userId", userId);

                navigation.replace("Home");
            }
            else {
                Alert.alert("Erro ao realizar o login, verifique seu username e senha");
            }
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                Alert.alert("Erro ao realizar o login, verifique seu username e senha");
            } else {
                Alert.alert("Erro ao realizar o login, verifique seu username e senha");
            }
        }
    };

    return (
        <View style={styles.containerMain}>
            <View style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>

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

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.replace("Register")}>
                        <Text >Já tem uma conta? Faça login</Text>
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
    containerImage: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: '100%',
        height: 500,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
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
