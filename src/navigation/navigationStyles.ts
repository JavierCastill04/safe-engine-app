import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { colores, tipografia } from '../theme';

export const getTabScreenOptions = (
    bottomInset: number
): BottomTabNavigationOptions => ({
    headerStyle: {
        backgroundColor: colores.negro,
    },

    headerTintColor: colores.enfasis,

    headerTitleStyle: {
        fontFamily: "Poppins",
        fontSize: 25
    },

    tabBarActiveTintColor: colores.texto,
    tabBarInactiveTintColor: colores.claro,

    tabBarStyle: {
        backgroundColor: colores.secundario,
        height: 65 + bottomInset,
        paddingTop: 5,
    },

    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },

    tabBarIconStyle: {
        marginTop: 1,
    },
});