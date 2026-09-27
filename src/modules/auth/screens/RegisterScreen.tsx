import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { commonStyles, colores } from "../../../theme";

export default function RegisterScreen() {
    return (
        <SafeAreaView>
            <View style={commonStyles.containerScreen}>
                <Text style={{ color: colores.claro }}>Bienvenido a Register</Text>
            </View>
        </SafeAreaView>
    );
}