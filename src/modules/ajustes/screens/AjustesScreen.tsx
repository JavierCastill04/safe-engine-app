import { View, Text } from "react-native"
import { commonStyles, colores } from "../../../theme";

export default function AjustesScreen() {
    return (
        <View style={commonStyles.containerScreen}>
            <Text style={{ color: colores.claro }}>Bienvenido a Ajustes</Text>
        </View>
    );
}