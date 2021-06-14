## Progress

✅ <b>Carousel Animation 1</b>

✅ <b>Timer Animation</b>

❗️ <b>Custom Drawer</b>
* The drawer is not performant as expected on Android (considering trying Reanimated).
* The drawer still has the slide-to-the-left behavior of a normal drawer. Tried setting <code>drawerType='permanent'</code> in RNDrawer.Navigator and <code>drawerType={{ width: 0 }}</code> but **doesn't work** on Android (considering using the ordinary <code>createStackNavigator</code> to navigate between screens and have the drawer appeared on top).