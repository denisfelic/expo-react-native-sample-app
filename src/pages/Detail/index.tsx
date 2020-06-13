import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';

interface Params {
    point_id: number
}

interface Data {
    point: {
        id: number,
        image: string;
        name: string;
        email: string;
        whatsapp: string;
        latitude: number;
        longitude: number;
        city: string;
        uf: string;
        street: string;
        number: string;
        cep: string;
    };

    items: {
        title: string;
    }[]
}

export default function Detail() {
    const [data, setData] = useState<Data>({} as Data);
    const navigate = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`)
            .then(response => {
                setData(response.data);
            });
    }, []);

    function handleNavigateBack() {
        navigate.goBack();
    }



    if (!data.point) {
        return null
    }

    function handleComposeMailn() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de residuos',
            recipients: [data.point.email],
        });
    }

    function handleWhatsApp(){
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=TesteBot`);
    }



    return (
        <View style={styles.contaner}>
            <SafeAreaView>

                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" color="#34cb79" size={20} />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={
                        {
                            uri: data.point.image
                        }
                    } />
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>{data.point.name}</Text>
                    <Text style={styles.descriptionPoints}>
                        {data.items.map(item => item.title).join(', ')}</Text>

                    <View >
                        <Text style={styles.enderecoTitle}>Endereço</Text>
                        <Text style={styles.enderecoDescription}> {data.point.city}, {data.point.uf}</Text>
                    </View>
                </View>

                <View style={styles.buttonsGroup} >
                    <RectButton style={styles.button} onPress={handleWhatsApp}>
                        <View style={styles.buttonIcon}><FontAwesome name='whatsapp' color='#fff' size={24} /></View>
                        <Text style={styles.buttonText}>WhatsApp</Text>
                    </RectButton>
                    <RectButton style={styles.button} onPress={handleComposeMailn}>
                        <View style={styles.buttonIcon}><Icon name='mail' color='#fff' size={24} /></View>
                        <Text style={styles.buttonText}>E-Mail</Text>
                    </RectButton>
                </View>
            </SafeAreaView>
        </View >
    )
}


const styles = StyleSheet.create({
    contaner: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 10,
    },
    imageContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10
    },

    descriptionContainer: {
        marginBottom: 200

    },
    descriptionTitle: {
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',

    },

    descriptionPoints: {
        marginTop: 4,
        fontSize: 16,
        color: '#34cb79',
        fontFamily: 'Roboto_400Regular',
        marginBottom: 20
    },

    enderecoTitle: {
        fontWeight: 'bold',
    },
    enderecoDescription: {
        fontSize: 20,
        color: 'gray'
    },
    buttonsGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15

    },
    button: {
        backgroundColor: '#34CB79',
        height: 60,
        width: '48%',
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 48,
        justifyContent: "center",
    },
    buttonIcon: {
        right: 20
    },
    buttonText: {
        textAlign: "center",
        color: '#fff'
    }
})