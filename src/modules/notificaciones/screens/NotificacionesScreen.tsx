import { View, Text } from "react-native"
import { commonStyles, colores } from "../../../theme";

export default function NotificacionesScreen() {
    return (
        <View style={commonStyles.containerScreen}>
            <Text style={{ color: colores.claro }}>Bienvenido a Notificaciones</Text>
        </View>
    );
}