import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TextInput, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import styles from './styles';  // CSS Styles
import { useNavigation } from '@react-navigation/native';



export default function Home() {

    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');



    const navigation = useNavigation();

    function handleNavigationPoints() {
        navigation.navigate('Points', {
            uf,
            city
        });

    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

            <ImageBackground
                style={styles.container}
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <View>
                        <Image source={require('../../assets/logo.png')} />
                        <Text style={styles.title}>Seu marketPlace de coleta de resíduos.</Text>
                        <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>

                    </View>
                </View>

                <View style={styles.footer}>

                    <TextInput style={styles.input} 
                    placeholder='Digite a UF' 
                    maxLength={2}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    value={uf} 
                    onChangeText={setUf} />
                    <TextInput style={styles.input} placeholder='Digite a cidade' value={city} autoCorrect={false} onChangeText={setCity} />

                    <RectButton style={styles.button} onPress={handleNavigationPoints}>
                        <View style={styles.buttonIcon}><Icon name='arrow-right' color='#fff' size={24} /></View>
                        <Text style={styles.buttonText}>Entrar</Text>

                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}
