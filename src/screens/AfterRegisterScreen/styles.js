import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  block_info: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  title_text_block: {
    alignItems: "center",
  },
  title_text: {
    fontSize: 20,
  },
  circle: {
    width: 178,
    height: 178,
    backgroundColor: "#F6F6F7",
    borderRadius: 100,
    marginTop: 39,
  },
  image: {
    width: 104,
    height: 104,
    position: "absolute",
    top: 38,
    left: 32,
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
});
