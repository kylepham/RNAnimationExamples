// Examples taken from Reanimated Docs

import React from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	PanGestureHandler,
	ScrollView,
	TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
	Easing,
	useSharedValue,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	withSpring,
	withTiming,
	withRepeat,
	withSequence,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

type ButtonProps = {
	onPress: () => void;
	title: string;
};

const Button = ({ onPress, title }: ButtonProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ marginVertical: 5 }}
			activeOpacity={0.5}
		>
			<Text
				style={{
					fontSize: 15,
					color: "rgb(0, 13, 94)",
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

const Example1 = () => {
	// https://docs.swmansion.com/react-native-reanimated/docs/shared-values
	// https://docs.swmansion.com/react-native-reanimated/docs/animations

	const BOX_SIZE = 60;
	const offset = useSharedValue(0);
	const rotation = useSharedValue(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: offset.value * 200 },
				{ rotateZ: `${rotation.value}deg` },
			],
		};
	});

	return (
		<View style={styles.animationContainer}>
			<Text style={styles.animationTitle}>Movement Example</Text>
			<Animated.View
				style={[
					{
						width: BOX_SIZE,
						height: BOX_SIZE,
						borderRadius: BOX_SIZE / 4,
						backgroundColor: "#333",
						marginBottom: 20,
					},
					animatedStyles,
				]}
			/>
			<Button
				onPress={() => (offset.value = Math.random())}
				title="Move Randomly"
			/>
			<Button
				onPress={() =>
					(offset.value = withSpring(Math.random(), {
						damping: 20,
						stiffness: 90,
					}))
				}
				title="Move Randomly Smoothly (withSpring)"
			/>
			<Button
				onPress={() =>
					(offset.value = withTiming(Math.random(), {
						duration: 500,
						easing: Easing.out(Easing.exp), // more info: https://easings.net/
					}))
				}
				title="Move Randomly Smoothly (withTiming)"
			/>
			<Button
				onPress={() =>
					(rotation.value = withSequence(
						withTiming(-10, { duration: 50 }),
						withRepeat(withTiming(10, { duration: 100 }), 6, true),
						withTiming(0, { duration: 50 })
					))
				}
				title="Wobble"
			/>
		</View>
	);
};

const Example2 = () => {
	// https://docs.swmansion.com/react-native-reanimated/docs/events

	const BALL_SIZE = 60;
	const pressed = useSharedValue(false);

	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (event, ctx) => {
			pressed.value = true;
		},
		onEnd: (event, ctx) => {
			pressed.value = false;
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: pressed.value ? "#FEEF86" : "#444",
			transform: [{ scale: withSpring(pressed.value ? 1.2 : 1) }],
		};
	});

	const textAnimatedStyles = useAnimatedStyle(() => {
		return {
			color: pressed.value ? "#000" : "#fff",
		};
	});

	return (
		<View style={styles.animationContainer}>
			<Text style={styles.animationTitle}>TapGesture Example</Text>
			<TapGestureHandler onGestureEvent={onGestureEvent}>
				<Animated.View
					style={[
						{
							width: BALL_SIZE,
							height: BALL_SIZE,
							borderRadius: BALL_SIZE / 2,
							backgroundColor: "#444",
							alignItems: "center",
							justifyContent: "center",
						},
						animatedStyles,
					]}
				>
					<Animated.Text style={textAnimatedStyles}>
						Tap me
					</Animated.Text>
				</Animated.View>
			</TapGestureHandler>
		</View>
	);
};

const Example3 = () => {
	// https://docs.swmansion.com/react-native-reanimated/docs/events

	const BALL_SIZE = 60;
	const pressed = useSharedValue(false);
	const startingPosition = 0;
	const x = useSharedValue(startingPosition);
	const y = useSharedValue(startingPosition);

	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (event, ctx) => {
			pressed.value = true;
		},
		onActive: (event, ctx) => {
			x.value = startingPosition + event.translationX;
			y.value = event.translationY;
		},
		onEnd: (event, ctx) => {
			pressed.value = false;
			x.value = withSpring(startingPosition);
			y.value = withSpring(startingPosition);
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: pressed.value ? "#FEEF86" : "#444",
			transform: [
				{ scale: withSpring(pressed.value ? 1.2 : 1) },
				{ translateX: x.value },
				{ translateY: y.value },
			],
		};
	});

	const textAnimatedStyles = useAnimatedStyle(() => {
		return {
			color: pressed.value ? "#000" : "#fff",
		};
	});

	return (
		<View style={styles.animationContainer}>
			<Text style={styles.animationTitle}>
				Drag(Pan)Gesture Example {"\n"} (with memorized original
				position)
			</Text>
			<PanGestureHandler onGestureEvent={onGestureEvent}>
				<Animated.View
					style={[
						{
							width: BALL_SIZE,
							height: BALL_SIZE,
							borderRadius: BALL_SIZE / 2,
							backgroundColor: "#444",
							alignItems: "center",
							justifyContent: "center",
						},
						animatedStyles,
					]}
				>
					<Animated.Text style={textAnimatedStyles}>
						Drag me
					</Animated.Text>
				</Animated.View>
			</PanGestureHandler>
		</View>
	);
};

const Example4 = () => {
	// https://docs.swmansion.com/react-native-reanimated/docs/events

	const BALL_SIZE = 60;
	const pressed = useSharedValue(false);
	const startingPosition = 0;
	const x = useSharedValue(startingPosition);
	const y = useSharedValue(startingPosition);

	const onGestureEvent = useAnimatedGestureHandler({
		onStart: (event, ctx) => {
			pressed.value = true;
			ctx.startX = x.value;
			ctx.startY = y.value;
		},
		onActive: (event, ctx) => {
			x.value = ctx.startX + event.translationX;
			y.value = ctx.startY + event.translationY;
		},
		onEnd: (event, ctx) => {
			pressed.value = false;
		},
	});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: pressed.value ? "#FEEF86" : "#444",
			transform: [{ translateX: x.value }, { translateY: y.value }],
		};
	});

	const textAnimatedStyles = useAnimatedStyle(() => {
		return {
			color: pressed.value ? "#000" : "#fff",
		};
	});

	return (
		<View style={styles.animationContainer}>
			<Text style={styles.animationTitle}>
				Drag(Pan)Gesture Example {"\n"} (without memorized original
				position)
			</Text>
			<PanGestureHandler onGestureEvent={onGestureEvent}>
				<Animated.View
					style={[
						{
							width: BALL_SIZE,
							height: BALL_SIZE,
							borderRadius: BALL_SIZE / 2,
							backgroundColor: "#444",
							alignItems: "center",
							justifyContent: "center",
						},
						animatedStyles,
					]}
				>
					<Animated.Text style={textAnimatedStyles}>
						Drag me
					</Animated.Text>
				</Animated.View>
			</PanGestureHandler>
			<Button
				onPress={() => {
					x.value = withSpring(0);
					y.value = withSpring(0);
				}}
				title="Snap to Original"
			/>
		</View>
	);
};

const ReanimatedExamples = () => {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Example1 />
			<Example2 />
			<Example3 />
			<Example4 />
		</ScrollView>
	);
};

export default ReanimatedExamples;

const styles = StyleSheet.create({
	animationContainer: {
		padding: 20,
		width: "90%",
		alignItems: "center",
		backgroundColor: "rgba(0, 13, 94, .1)",
		borderRadius: 20,
		marginBottom: 20,
	},
	animationTitle: {
		color: "rgb(0, 13, 94)",
		fontSize: width / 22,
		fontWeight: "bold",
		textDecorationLine: "underline",
		marginBottom: 10,
		textAlign: "center",
	},
	container: {
		paddingTop: 40,
		width,
		alignItems: "center",
		minHeight: height,
	},
});
