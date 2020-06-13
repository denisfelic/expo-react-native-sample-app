import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location';


interface Item {
	id: number;
	name: string;
	image_url: string;
}

interface Point {
	id: string;
	image: string;
	name: string;
	latitude: number;
	longitude: number;
}

interface Params {
	uf: string;
	city: string;
}

export default function Point() {
	const routes = useRoute()
	const navigate = useNavigation();
	const [items, setItems] = useState<Item[]>([]);
	const [points, setPoints] = useState<Point[]>([]);
	const [selecteditems, setSelectedItems] = useState<number[]>([]);
	const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);


	const routeParams = routes.params as Params;


	useEffect(() => {
		api.get('/items').then(response => {
			setItems(response.data);
		});
	}, []);

	useEffect(() => {
		async function loadPosition() {
			const { status } = await Location.requestPermissionsAsync();

			if (status !== 'granted') {
				Alert.alert('Oooops...', ' Precisamos de sua permissão para obter a sua localização.');
				return;
			}

			const location = Location.getCurrentPositionAsync();

			const { latitude, longitude } = (await location).coords;
			setCurrentPosition([latitude, longitude]);
		}

		loadPosition();
	}, []);

	useEffect(() => {
		api.get('points', {
			params: {
				uf: routeParams.uf,
				items: selecteditems,
				city: routeParams.city
			}
		}).then((response) => {
			setPoints(response.data);
		});
	});

	function handleSelectedItems(id: number) {
		const alreadySelected = selecteditems.findIndex(item => item === id);

		if (alreadySelected >= 0) {
			const filteredItems = selecteditems.filter(item => item != id);
			setSelectedItems(filteredItems)
		}
		else {
			setSelectedItems([...selecteditems, id]);
		}

	}

	function handleNavigateBack() {
		navigate.goBack();
	}

	function handleNavigateToDetail(id: number) {
		navigate.navigate('Detail', { point_id: id });
	}

//
	return (
		<View style={styles.container} >
			<TouchableOpacity onPress={handleNavigateBack}>
				<Icon name="arrow-left" size={20} color="#34cb79" />
			</TouchableOpacity>
			<Text style={styles.title}>Bem Víndo.</Text>
			<Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

			<View style={styles.mapContainer} >
				{currentPosition[0] !== 0 && (
					<MapView
						loadingEnabled={currentPosition[0] === 0}
						style={styles.map}
						initialRegion={
							{
								latitude: currentPosition[0],
								longitude: currentPosition[1],
								latitudeDelta: 0.026,
								longitudeDelta: 0.026,
							}
						}

					>
						{points.map(point => (
							<Marker
								key={String(point.id)}
								style={styles.mapMarker}
								onPress={() => { handleNavigateToDetail(Number(point.id)) }}
								coordinate={{
									latitude: point.latitude,
									longitude: point.longitude,
								}}
							>
								<View style={styles.mapMarkerContainer}>
									<Image
										style={styles.mapMarkerImage}
										source={
											{
												uri: point.image
											}
										}
									/>
									<Text style={styles.mapMarkerTitle}>{point.name}</Text>
								</View>

							</Marker>
						))}
					</MapView>
				)}
			</View>

			<View style={styles.itemsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 0 }}
				>
					{items.map(item => (
						<TouchableOpacity
							key={String(item.id)}
							style={[
								styles.item,
								selecteditems.includes(item.id) ? styles.selectedItem : {}
							]}
							onPress={() => { handleSelectedItems(item.id) }}
							activeOpacity={0.5}

						>
							<SvgUri
								width={42}
								height={42}
								uri={item.image_url}
							/>
							<Text style={styles.itemTitle}>{item.name}</Text>
						</TouchableOpacity>
					))}


				</ScrollView>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 32,
		paddingTop: 20 + Constants.statusBarHeight,
	},

	title: {
		fontSize: 20,
		fontFamily: 'Ubuntu_700Bold',
		marginTop: 24,
	},

	description: {
		color: '#6C6C80',
		fontSize: 16,
		marginTop: 4,
		fontFamily: 'Roboto_400Regular',
	},

	mapContainer: {
		flex: 1,
		width: '100%',
		borderRadius: 10,
		overflow: 'hidden',
		marginTop: 16,
	},

	map: {
		width: '100%',
		height: '100%',
	},

	mapMarker: {
		width: 90,
		height: 80,
	},

	mapMarkerContainer: {
		width: 90,
		height: 70,
		backgroundColor: '#34CB79',
		flexDirection: 'column',
		borderRadius: 8,
		overflow: 'hidden',
		alignItems: 'center'
	},

	mapMarkerImage: {
		width: 90,
		height: 45,
		resizeMode: 'cover',
	},

	mapMarkerTitle: {
		flex: 1,
		fontFamily: 'Roboto_400Regular',
		color: '#FFF',
		fontSize: 13,
		lineHeight: 23,
	},

	itemsContainer: {
		flexDirection: 'row',
		marginTop: 16,
		marginBottom: 32,
	},

	item: {
		backgroundColor: '#fff',
		borderWidth: 2,
		borderColor: '#eee',
		height: 120,
		width: 120,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 16,
		marginRight: 8,
		alignItems: 'center',
		justifyContent: 'space-between',

		textAlign: 'center',
	},

	selectedItem: {
		borderColor: '#34CB79',
		borderWidth: 2,
	},

	itemTitle: {
		fontFamily: 'Roboto_400Regular',
		textAlign: 'center',
		fontSize: 13,
	},
});