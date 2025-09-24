import { createDrawerNavigator } from '@react-navigation/drawer';

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});