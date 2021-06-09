import React, { FC, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
	Animated,
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const bgs = ["#A5BBFF", "#DDBEFE", "#FF63ED", "#B98EFF"];
const DATA = [
	{
		key: "3571572",
		title: "Multi-lateral intermediate moratorium",
		description:
			"I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
		image: "https://image.flaticon.com/icons/png/256/3571/3571572.png",
	},
	{
		key: "3571747",
		title: "Automated radical data-warehouse",
		description:
			"Use the optical SAS system, then you can navigate the auxiliary alarm!",
		image: "https://image.flaticon.com/icons/png/256/3571/3571747.png",
	},
	{
		key: "3571680",
		title: "Inverse attitude-oriented system engine",
		description:
			"The ADP array is down, compress the online sensor so we can input the HTTP panel!",
		image: "https://image.flaticon.com/icons/png/256/3571/3571680.png",
	},
	{
		key: "3571603",
		title: "Monitored global data-warehouse",
		description: "We need to program the open-source IB interface!",
		image: "https://image.flaticon.com/icons/png/256/3571/3571603.png",
	},
];
const { width, height } = Dimensions.get("screen");

type Props = {
	scrollX: Animated.Value;
};

type AuthButtonsProps = {};

const BottomBar: FC<Props> = ({ scrollX }) => {
	return (
		<View
			style={{
				position: "absolute",
				bottom: 40,
				flexDirection: "row",
				justifyContent: "space-between",
				width,
				paddingHorizontal: 20,
			}}
		>
			<TouchableOpacity style={{ paddingTop: 5 }}>
				<Text>Skip</Text>
			</TouchableOpacity>

			<View style={{ flexDirection: "row" }}>
				{DATA.map((_, i) => {
					const scale = scrollX.interpolate({
						inputRange: [
							(i - 1) * width,
							i * width,
							(i + 1) * width,
						],
						outputRange: [0.8, 1.4, 0.8],
						extrapolate: "clamp",
					});

					const opacity = scrollX.interpolate({
						inputRange: [
							(i - 1) * width,
							i * width,
							(i + 1) * width,
						],
						outputRange: [0.6, 9, 0.6],
						extrapolate: "clamp",
					});

					return (
						<Animated.View
							key={i}
							style={{
								height: 10,
								width: 10,
								borderRadius: 5,
								backgroundColor: "#fff",
								margin: 10,
								opacity,
								transform: [{ scale }],
							}}
						/>
					);
				})}
			</View>

			<TouchableOpacity style={{ paddingTop: 5 }}>
				<Text>Next</Text>
			</TouchableOpacity>
		</View>
	);
};

const Backdrop: FC<Props> = ({ scrollX }) => {
	const backgroundColor = scrollX.interpolate({
		inputRange: bgs.map((_, i) => i * width),
		outputRange: bgs.map((bg) => bg),
	});
	return (
		<Animated.View
			style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
		/>
	);
};

const Square: FC<Props> = ({ scrollX }) => {
	const YOLO = Animated.modulo(
		Animated.divide(
			Animated.modulo(scrollX, width),
			new Animated.Value(width)
		),
		1
	);

	const opacity = YOLO.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [1, 0, 1],
	});

	const rotate = YOLO.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: ["15deg", "70deg", "15deg"],
	});

	const translateX = YOLO.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [-160, -height / 2, -160],
	});

	return (
		<Animated.View
			style={{
				position: "absolute",
				width: height,
				height,
				backgroundColor: "#fff",
				borderRadius: 86,
				top: -height * 0.55,
				left: -height * 0.3,
				opacity,
				transform: [
					{
						rotate,
					},
					{
						translateX,
					},
				],
			}}
		></Animated.View>
	);
};

const AuthButtons: FC<AuthButtonsProps> = () => {
	const BUTTON_HEIGHT = height * 0.065;
	const buttonStyle: ViewStyle = {
		width: width * 0.42,
		height: BUTTON_HEIGHT,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 6,
	};
	const textStyle: TextStyle = {
		fontSize: height * 0.017,
		fontWeight: "700",
	};

	return (
		<View
			style={{
				position: "absolute",
				flexDirection: "row",
				justifyContent: "space-between",
				top: height * 0.75,
				width,
				paddingHorizontal: 20,
			}}
		>
			<TouchableOpacity>
				<View style={buttonStyle}>
					<Text style={textStyle}>Log in</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity>
				<View style={buttonStyle}>
					<Text style={textStyle}>Create Account </Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const CarouselAnimation1 = () => {
	const scrollX = useRef(new Animated.Value(0)).current;

	return (
		<View style={styles.container}>
			<StatusBar translucent />
			<Backdrop scrollX={scrollX} />
			<Square scrollX={scrollX} />
			<Animated.FlatList
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				data={DATA}
				scrollEventThrottle={32}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false }
				)}
				keyExtractor={(item) => item.key}
				contentContainerStyle={{
					height: height * 0.8,
					// backgroundColor: "#333",
				}}
				renderItem={({ item }) => {
					return (
						<View style={{ width, padding: 20 }}>
							<View
								style={{
									flex: 0.7,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Image
									source={{ uri: item.image }}
									style={{
										width: width / 2,
										height: width / 2,
										resizeMode: "contain",
									}}
								/>
							</View>
							<View
								style={{
									flex: 0.3,
									// backgroundColor: "#fff"
								}}
							>
								<Text
									style={{
										color: "#fff",
										fontWeight: "800",
										fontSize: 28,
										marginBottom: 10,
									}}
								>
									{item.title}
								</Text>
								<Text
									style={{ color: "#fff", fontWeight: "300" }}
								>
									{item.description}
								</Text>
							</View>
						</View>
					);
				}}
			/>
			<AuthButtons />

			<BottomBar scrollX={scrollX} />
		</View>
	);
};

export default CarouselAnimation1;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
});
