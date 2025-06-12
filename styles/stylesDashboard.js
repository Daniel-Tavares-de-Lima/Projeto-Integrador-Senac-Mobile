
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  userText: {
    fontSize: 16,
    color: "#2d4a78",
    marginLeft: 5,
    marginRight: 10,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  menuNav: {
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
  },
  menuNavi: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
