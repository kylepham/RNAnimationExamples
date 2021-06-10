// Src: https://www.youtube.com/watch?v=z9l5WXPKCpA

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
	Vibration,
	StatusBar,
	TextInput,
	Dimensions,
	Animated,
	TouchableOpacity,
	View,
	StyleSheet,
} from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("screen");
const colors = {
	black: "#323F4E",
	red: "#F76A6A",
	text: "#ffffff",
};
const timers = [...Array(13).keys()].map(i => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const TimerAnimation: FC = () => {
	const [loaded] = useFonts({
		Menlo: require("../assets/fonts/Menlo-Regular.ttf"),
	});

	const scrollX = useRef(new Animated.Value(0)).current;
	const timerAnimation = useRef(new Animated.Value(height)).current; // start from the very bottom of the screen
	const buttonAnimation = useRef(new Animated.Value(0)).current; // start from the very bottom of the screen
	const textInputAnimation = useRef(new Animated.Value(timers[0])).current;
    const inputRef = useRef<TextInput>(null);

	const [duration, setDuration] = useState(timers[0]);

    useEffect(() => {
        const listener = textInputAnimation.addListener(({value}) => {
            inputRef?.current?.setNativeProps({
                text: Math.ceil(value).toString()
            })
        })
        
        return () => {
            textInputAnimation.removeListener(listener)
        }
    })

	const animation = useCallback(() => {
        textInputAnimation.setValue(duration)
		Animated.sequence(
			// "Starts an array of animations in order, waiting for each to complete before starting the next"
			[
				Animated.timing(buttonAnimation, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(timerAnimation, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.parallel([
                    Animated.timing(textInputAnimation, {
                        toValue: 0,
                        duration: duration * 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(timerAnimation, {
                        toValue: height,
                        duration: duration * 1000,
                        useNativeDriver: true,
                    })
                ]),
                Animated.delay(400)
			]
		).start(() => {
			// as a result, putting back the button thru an animation
            Vibration.cancel()
            Vibration.vibrate()
            textInputAnimation .setValue(duration)
			Animated.timing(buttonAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		});
	}, [duration]);

	const buttonOpacity = buttonAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0],
	});

	const buttonTranslateY = buttonAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 200], // Starts at 0 because the button is at the very top (0px) of the buttonView, then move down 200px
	});

	const timeOpacity = buttonAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	if (!loaded) return null;

	return (
		<View style={styles.container}>
			<StatusBar translucent barStyle="light-content" />

			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					{
						height,
						width,
						transform: [{ translateY: timerAnimation }],
						backgroundColor: colors.red,
					},
				]}
			/>

			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					{
						justifyContent: "flex-end",
						alignItems: "center",
						paddingBottom: 100,
						opacity: buttonOpacity,
						transform: [{ translateY: buttonTranslateY }],
					},
				]}
			>
				<TouchableOpacity onPress={animation}>
					<View style={styles.roundButton} />
				</TouchableOpacity>
			</Animated.View>

			<View
				style={{
					position: "absolute",
					top: height / 3,
					left: 0,
					right: 0,
					flex: 1,
				}}
			>
				<Animated.View
					style={{
						position: "absolute",
						width: ITEM_SIZE,
						justifyContent: "center",
						alignItems: "center",
						alignSelf: "center",
                        opacity: timeOpacity,
					}}
				>
					<TextInput
						ref={inputRef}
						style={styles.text}
						defaultValue={duration.toString()}
					/>
				</Animated.View>

				<Animated.FlatList
					horizontal
					bounces={false}
					showsHorizontalScrollIndicator={false}
					data={timers}
					keyExtractor={(item) => item.toString()}
					snapToInterval={ITEM_SIZE}
					decelerationRate="fast"
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: true }
					)}
					onMomentumScrollEnd={(event) => {
						const index = Math.round(
							event.nativeEvent.contentOffset.x / ITEM_SIZE
						);
						setDuration(timers[index]);
					}}
					style={{ flexGrow: 0, opacity: buttonOpacity }}
					contentContainerStyle={{
						paddingHorizontal: ITEM_SPACING,
					}}
					renderItem={({ item, index }) => {
						const inputRange = [
							(index - 1) * ITEM_SIZE,
							index * ITEM_SIZE,
							(index + 1) * ITEM_SIZE,
						];

						const opacity = scrollX.interpolate({
							inputRange,
							outputRange: [0.4, 1, 0.4], // two numbers at two edges will have opacity of .4
						});

						const scale = scrollX.interpolate({
							inputRange,
							outputRange: [0.4, 1, 0.4],
						});

						return (
							<View
								style={{
									width: ITEM_SIZE,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Animated.Text
									style={[
										styles.text,
										{ opacity, transform: [{ scale }] },
									]}
								>
									{item}
								</Animated.Text>
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
};

export default TimerAnimation;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.black,
	},
	roundButton: {
		width: 80,
		height: 80,
		borderRadius: 80,
		backgroundColor: colors.red,
	},
	text: {
		fontSize: ITEM_SIZE * 0.8,
		fontFamily: "Menlo",
		color: colors.text,
		fontWeight: "900",
	},
});
