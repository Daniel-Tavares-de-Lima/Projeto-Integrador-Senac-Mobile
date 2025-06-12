import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Telas
import LoginScreen from "./screens/loginScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import HomeScreen from "./screens/HomeScreen";
import VictimsScreen from "./screens/vitimaScreen";
import CasesScreen from "./screens/caseScreen";
import EvidenciaScreen from "./screens/EvidenciaScreen";
import DashboardScreen from "./screens/dashboardScreen";
import ProfessionalScreen from "./screens/ProfissionalScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer customizado com logo no topo
function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      {/* LOGO NO TOPO */}
      <View
        style={{
          alignItems: "center",
          paddingVertical: 30,
          backgroundColor: "#3C68A2",
        }}
      >
        <Image
          source={require("./assets/logo.png")} // Caminho da sua logo
          style={{ width: 200, height: 120, resizeMode: "contain" }}
        />
      </View>

      {/* LISTA DE ITENS */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#3C68A2",
          width: 250,
        },
        drawerActiveTintColor: "#f5f5f5",
        drawerInactiveTintColor: "#fff",
        drawerLabelStyle: {
          fontSize: 18,
          fontWeight: "500",
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Victims"
        component={VictimsScreen}
        options={{
          title: "Vítimas",
          drawerIcon: ({ color, size }) => (
            <Icon name="account-heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cases"
        component={CasesScreen}
        options={{
          title: "Casos",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profissionais"
        component={ProfessionalScreen}
        options={{
          title: "Profissionais",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Evidencia"
        component={EvidenciaScreen}
        options={{
          title: "Evidência",
          drawerIcon: ({ color, size }) => (
            <Icon name="image-multiple-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Icon name="chart-box-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AuthLoading"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
