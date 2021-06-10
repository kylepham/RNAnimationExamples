import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { _Default, CarouselAnimation1, TimerAnimation } from "./screens";
export type RootStackParamList = {
	Default: undefined;
	Carousel1: undefined;
    TimerAnimation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: FC = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator headerMode="none" initialRouteName="Default">
				<Stack.Screen name="Default" component={_Default} />
				<Stack.Screen name="Carousel1" component={CarouselAnimation1} />
				<Stack.Screen name="TimerAnimation" component={TimerAnimation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
