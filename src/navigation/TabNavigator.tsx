
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, Car, Engine, Home } from 'lucide-react-native';
import type { TabNavigatorParamList, RootStackParamList } from './types';
import { tabScreenOptions } from './navigationStyles';
import { colores } from '../theme';
import HomeScreen from '../modules/home/screens/HomeScreen';
import VehiculosScreen from '../modules/vehiculos/screens/VehiculosScreen';
import AjustesScreen from '../modules/ajustes/screens/AjustesScreen';
import NotificacionesScreen from '../modules/notificaciones/screens/NotificacionesScreen';


const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export default function PersonalNavigator() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                ...tabScreenOptions,
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case 'Home': return <Home color={color} size={size} />;
                        case 'Vehiculos': return <Car color={color} size={size} />;
                        case 'Notificaciones': return <Bell color={color} size={size} />;
                        case 'Ajustes': return <Engine color={color} size={size} />;
                        default: return null;
                    }
                },
                animation: 'none'
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Panel principal' }} />
            <Tab.Screen name="Vehiculos" component={VehiculosScreen} options={{ headerTitle: 'Vehículos registrados' }} />
            <Tab.Screen name="Notificaciones" component={NotificacionesScreen} options={{ headerTitle: 'Notificaciones' }} />
            <Tab.Screen name="Ajustes" component={AjustesScreen} options={{ headerTitle: 'Ajustes de aplicación' }} />
        </Tab.Navigator>
    );
}