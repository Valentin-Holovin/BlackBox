import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    flex: 1,
  },
  circle: {
    marginTop: 140,
    width: 178,
    height: 178,
    backgroundColor: "#F6F6F7",
    borderRadius: 100,
  },
  image: {
    width: 104,
    height: 104,
    position: "absolute",
    top: 38,
    left: 38,
  },
  text_block: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 43,
  },
  title_text: {
    fontSize: 36,
    fontWeight: "600",
  },
  text_info_block: {
    marginVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    borderBottomWidth: 1,
    width: 90,
    borderColor: "#9DA4AE",
  },
  text_info: {
    color: "#9DA4AE",
    fontSize: 17,
    marginRight: 10,
    marginLeft: 10,
  },
  button_container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#057772",
    width: 331,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text_button: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  button_new: {
    borderWidth: 1.5,
    borderColor: "#057772",
    width: 331,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text_button_new: {
    color: "#057772",
    fontSize: 18,
    fontWeight: "600",
  },
});
