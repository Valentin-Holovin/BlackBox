import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  form_container: {
    marginTop: 20,
  },
  form_block: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#057772",
    width: 331,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text_button: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  text_error: {
    position: "absolute",
    fontSize: 17,
    color: "red",
    fontWeight: "500",
  },
});
