import EvidenciaScreen from "../screens/EvidenciaScreen";
import LoginScreen from "../screens/loginScreen"; 
import { Text } from "react-native";


const Drawer = createDrawerNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Dashboard" }}
        />
        <Drawer.Screen
          name="Cases"
          component={CasesScreen}
          options={{ title: "Casos" }}
        />
        <Drawer.Screen
          name="Victims"
          component={VictimsScreen}
          options={{ title: "Vítimas" }}
        />
        <Drawer.Screen
          name="Evidencia"
          component={EvidenciaScreen}
          options={{ title: "Evidências" }}
        />
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
