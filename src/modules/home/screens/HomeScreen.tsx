import { View, Text } from "react-native"
import { commonStyles, colores, tipografia } from "../../../theme";

export default function HomeScreen() {
    return (
        <View style={commonStyles.containerScreen}>
            <Text style={{color: colores.claro}}>Bienvenido a Home</Text>
        </View>
    );
}