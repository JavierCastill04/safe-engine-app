import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import OdometroScreen from '../modules/odometro/screens/OdometroScreen';
import ReportesScreen from '../modules/reportes/screens/ReportesScreen';
import HistorialMantenimientoScreen from '../modules/mantenimientos/screens/HistorialMantenimientosScreen';
import TabNavigator from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="Odometro" component={OdometroScreen} options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="Reportes" component={ReportesScreen} options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false, animation: "slide_from_right" }} />
            
            {/* 👇 2. AGREGAR LA PANTALLA AQUÍ */}
            <Stack.Screen 
              name="HistorialMantenimientoScreen" 
              component={HistorialMantenimientoScreen} 
              options={{ headerShown: false, animation: "slide_from_right" }} 
            />
        </Stack.Navigator>
    );
}