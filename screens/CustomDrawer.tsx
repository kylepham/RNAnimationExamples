import React, { FC, useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Polygon } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";
import {
	createDrawerNavigator,
	DrawerNavigationProp,
	useIsDrawerOpen,
} from "@react-navigation/drawer";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";

import { colors, links } from "../utils/CustomDrawer";

type RootDrawerParamList = {
	GetStarted: undefined;
	Features: undefined;
	Tools: undefined;
	Services: undefined;
	Portfolio: undefined;
	Careers: undefined;
	Contact: undefined;
};

type ButtonProps = {
	title: string;
	onPress: () => void;
	style: Array<TextStyle>;
};

type DrawerProps = {
	navigation: DrawerNavigationHelpers;
	routes: Array<string>;
	selectedRoute: string;
};

type ScreenProps = {
	label: string;
	backgroundColor: string;
	navigation: DrawerNavigationProp<RootDrawerParamList>;
};

const RNDrawer = createDrawerNavigator<RootDrawerParamList>();
const { width, height } = Dimensions.get("screen");
const fromCoords = { x: 0, y: height };
const toCoords = { x: width, y: 0 };

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView);

const Button: FC<ButtonProps> = ({ title, onPress, style }) => {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.9}>
			<Text style={style}>{title}</Text>
		</TouchableOpacity>
	);
};

const Drawer: FC<DrawerProps> = ({ navigation, routes, selectedRoute }) => {
	const polygonRef = useRef<any>();
	const svgAnimatedValue = useRef(new Animated.ValueXY(fromCoords)).current;
	const maskedViewWidthAnimatedValue = useRef(new Animated.Value(0)).current;

	const isDrawerOpen = useIsDrawerOpen();

	useEffect(() => {
        animate(isDrawerOpen ? 1 : 0).start()


	}, [isDrawerOpen]);

	const animate = (toValue: number) => {
		const animations = [
			Animated.timing(maskedViewWidthAnimatedValue, {
				toValue: toValue === 1 ? width : 0,
				duration: 0,
				useNativeDriver: false,
			}),
			Animated.timing(svgAnimatedValue, {
				toValue: toValue === 1 ? toCoords : fromCoords,
				duration: 300,
				useNativeDriver: true,
			}),
		];

		return Animated.sequence(
			toValue === 1 ? animations : animations.reverse()
		);
	};

	useEffect(() => {
		const x = svgAnimatedValue.addListener((value) => {
			polygonRef?.current.setNativeProps({
				// change props of AnimatedPolygon
				points: `
                    0,0 
                    ${value.x},${value.y} 
                    ${width},${height} 
                    0,${height}
                `,
			});
		});
        return () => {
            svgAnimatedValue.removeListener(x)
        }
	});

	const opacity = svgAnimatedValue.y.interpolate({
		inputRange: [0, height],
		outputRange: [1, 0.2],
	});

	const translateX = svgAnimatedValue.y.interpolate({
		inputRange: [0, height],
		outputRange: [0, -width * 0.5],
	});

	return (
		<AnimatedMaskedView
			maskElement={
				<Svg
					width={width}
					height={height}
					viewBox={`0 0 ${width} ${height}`} // x y width height
					style={{ backgroundColor: "transparent" }}
				>
					{/* https://github.com/react-native-svg/react-native-svg#polygon */}
					<AnimatedPolygon
						ref={polygonRef}
						fill="blue"
						points={`
                            0,0 
                            ${fromCoords.x},${fromCoords.y} 
                            ${width},${height} 
                            0,${height}
                        `}
					/>
				</Svg>
			}
			style={{
				flex: 1,
				width: maskedViewWidthAnimatedValue
			}}
		>
			<View style={styles.menuContainer}>
				<AntDesign
					name="close"
					size={34}
					color="white"
					onPress={() => {navigation.closeDrawer();}}
					style={{ position: "absolute", top: 40, right: 20 }}
				/>

				<Animated.View
					style={[
						styles.menu,
						{ opacity, transform: [{ translateX }] },
					]}
				>
					<View>
						{routes.map((route, index) => {
							return (
								<Button
									title={route}
									key={index}
									onPress={() => {
										navigation.navigate(route);
										animate(0) // 0 (!= 1) means close
											.start();
									}}
									style={[
										styles.button,
										{
											color: colors[index],
											textDecorationLine:
												selectedRoute === route
													? "line-through"
													: "none",
										},
									]}
								/>
							);
						})}
					</View>

					<View>
						{links.map((link, index) => {
							return (
								<Button
									title={link}
									key={index}
									onPress={() => navigation.closeDrawer()}
									style={[
										styles.buttonSmall,
										{
											color: colors[
												index + routes.length
											],
										},
									]}
								/>
							);
						})}
					</View>
				</Animated.View>
			</View>
		</AnimatedMaskedView>
	);
};

// ====================== SCREENS WHEN A ROUTE IS SELECTED ====================== //

const Screen: FC<ScreenProps> = ({ label, backgroundColor, navigation }) => {
	return (
		<SafeAreaView
			style={{
				backgroundColor,
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<AntDesign
				name="menu-fold"
				size={34}
				color="#222"
				onPress={() => navigation.openDrawer()}
				style={{
					position: "absolute",
					top: 40,
					right: 20,
				}}
			/>
			<Text style={{ fontSize: 42 }}>{label}</Text>
		</SafeAreaView>
	);
};

const GetStarted: FC<any> = ({ navigation }) => {
	return (
        <Screen
            backgroundColor={colors[0]}
            label="Get Started"
            navigation={navigation}
        />
	);
};
const Features: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[1]}
			label="Features"
			navigation={navigation}
		/>
	);
};
const Tools: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[2]}
			label="Tools"
			navigation={navigation}
		/>
	);
};
const Services: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[3]}
			label="Services"
			navigation={navigation}
		/>
	);
};
const Portfolio: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[4]}
			label="Portfolio"
			navigation={navigation}
		/>
	);
};
const Careers: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[5]}
			label="Careers"
			navigation={navigation}
		/>
	);
};
const Contact: FC<any> = ({ navigation }) => {
	return (
		<Screen
			backgroundColor={colors[6]}
			label="Contact"
			navigation={navigation}
		/>
	);
};

//              ====================== END ======================                 //

const CustomDrawer = () => {
    // const [drawerWidth, setDrawerWidth] = useState<number>(0)
    const [type, setType] = useState<"front" | "back" | "slide" | "permanent" | undefined>('back')
	return (
		<RNDrawer.Navigator
			initialRouteName="GetStarted"
			overlayColor="transparent"
			drawerStyle={{ 
                backgroundColor: "transparent", 
                width: '100%',
            }}
			
			drawerContent={(props) => {
				return (
					<Drawer
						navigation={props.navigation}
						routes={props.state.routeNames}
						selectedRoute={
							props.state.routeNames[props.state.index]
						}
					/>
				);
			}}
		>
			<RNDrawer.Screen name="GetStarted" component={GetStarted} />
			<RNDrawer.Screen name="Features" component={Features} />
			<RNDrawer.Screen name="Tools" component={Tools} />
			<RNDrawer.Screen name="Services" component={Services} />
			<RNDrawer.Screen name="Portfolio" component={Portfolio} />
			<RNDrawer.Screen name="Careers" component={Careers} />
			<RNDrawer.Screen name="Contact" component={Contact} />
		</RNDrawer.Navigator>
	);
};

export default CustomDrawer;

const styles = StyleSheet.create({
	button: {
		fontSize: 32,
		color: "#fdfdfd",
		lineHeight: 32 * 1.5,
	},
	buttonSmall: {
		fontSize: 16,
		marginBottom: 5,
		color: "#fdfdfd",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	maskedContainer: {
		flex: 1,
	},
	menu: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	menuContainer: {
		flex: 1,
		// width: "100%",
		backgroundColor: "#222",
		paddingTop: 80,
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
});
