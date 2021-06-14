import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { StatusBar } from "expo-status-bar";

type Props = StackScreenProps<RootStackParamList, "Default">;

type ButtonProps = {
	style: object;
	text: string;
	[x: string]: any; // rest of the props
};

const Button: FC<ButtonProps & {}> = ({ style, text, ...rest }) => {
	return (
		<TouchableOpacity {...rest}>
			<Text style={style}>{text}</Text>
		</TouchableOpacity>
	);
};

const _Default: FC<Props> = ({ navigation }) => {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<StatusBar translucent />

			<Button
				style={styles.text}
				onPress={() => navigation.navigate("Carousel1")}
				text="🐒 Carousel Animation #1"
			/>

			<Button
				style={styles.text}
				onPress={() => navigation.navigate("TimerAnimation")}
				text="🐒 Timer Animation"
			/>

			<Button
				style={styles.text}
				onPress={() => navigation.navigate("CustomDrawer")}
				text="🐒 Custom Drawer"
			/>
		</ScrollView>
	);
};

export default _Default;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 20,
		fontWeight: "800",
        marginBottom: 20,
	},
});
