import { View, Text } from "react-native"
import { commonStyles, colores } from "../../../theme";

export default function VehiculosScreen() {
    return (
        <View style={commonStyles.containerScreen}>
            <Text style={{ color: colores.claro }}>Bienvenido a Vehiculos</Text>
        </View>
    );
}