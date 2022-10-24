import {
  View,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import { DEVICES_URL, LOGIN_URL } from "../../utils/url";
import { styles } from "./styles";
import { connect } from "react-redux";

const ViewDevicesScreen = ({ navigation, userName, password }) => {
  const ref = useRef(null);
  const [url, setUrl] = useState(DEVICES_URL);

  useFocusEffect(
    React.useCallback(() => {
      const handler = () => {
        ref.current.goBack();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", handler);
      navigation.closeDrawer();
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handler);
      };
    }, [])
  );

  const [isPostsLoading, setIsPostsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (ref.current) {
        setUrl(DEVICES_URL);
        ref.current.reload();
      }
    }, [])
  );

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      document.getElementsByClassName('col-12 col-lg-6')[0].style.display = "none";
      document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
      document.getElementsByClassName('footer pt-0')[0].style.display = 'none';
      document.getElementsByClassName('btn btn-neutral ')[0].style.display = 'none';
  
      setTimeout(() => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'loadingFinish',
          })
        );
      }, 1500)
    }, 1500)
  `;

  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "buttonDesc":
        navigation.navigate("View Devices");
        break;
      case "buttonChart":
        navigation.navigate("Raw Data");
        break;
      case "loadingFinish":
        setIsPostsLoading(false);
        break;
      case "buttonData":
        setCanGoBack(true);
        break;
      case "buttonReg":
        setCanGoBack(true);
        break;
      default: {
      }
    }
  };

  const onScroll = (event) => {
    setIsScrolledToTop(event.nativeEvent.contentOffset.y < 100);
  };

  const getRefreshControl = () => {
    if (!isScrolledToTop) {
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }, 700);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          enabled={getRefreshControl()}
          refreshing={false}
          onRefresh={() => {
            ref.current.reload();
          }}
        />
      }
    >
      <View>
        <View style={styles.webview}>
          <WebView
            nestedScrollEnabled={true}
            source={{ uri: DEVICES_URL }}
            ref={ref}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            tartInLoadingState={true}
            javaScriptEnabled={true}
            onMessage={onMessage}
            onLoadStart={() => setIsPostsLoading(true)}
            onLoad={() => setIsPostsLoading(false)}
            onScroll={onScroll}
          />
          {isPostsLoading && (
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color="#5E72E4"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({
  userName: state.login.userName,
  password: state.login.password,
});

export default connect(mapStateToProps)(ViewDevicesScreen);
