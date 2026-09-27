import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { commonStyles, colores } from "../../../theme";

export default function MantenimientosScreen() {
    return (
        <SafeAreaView>
            <View style={commonStyles.containerScreen}>
                <Text style={{ color: colores.claro }}>Bienvenido a Mantenimientos</Text>
            </View>
        </SafeAreaView>
    );
}