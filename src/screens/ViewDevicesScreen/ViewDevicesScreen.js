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
import { DEVICES_URL, DASHBOARD_URL } from "../../utils/url";
import { styles } from "./styles";
import { connect } from "react-redux";

const ViewDevicesScreen = ({ navigation }) => {
  const ref = useRef(null);
  const [url, setUrl] = useState(global.URLDEVICE);

  useFocusEffect(
    React.useCallback(() => {
      const handler = () => {
        if (global.prevScreen.includes(DASHBOARD_URL)) {
          navigation.navigate("Dashboard");
        } else {
          navigation.navigate("Devices");
        }
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
        setUrl(global.URLDEVICE);
        ref.current.reload();
      }
    }, [])
  );

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      var names = document.getElementsByClassName('btn btn-neutral mb-2');
        for(var i = 0; i < names.length; i++){
          for(var i = 0; i < names.length; i++){
          let atag = names[i];
              console.log(atag.innerText);
          if(!atag.innerText.includes('Device Settings') && !atag.innerText.includes('Edit Device')){
              atag.style.display = 'none';
          }
          }
        }
      document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
      document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
      document.getElementsByClassName('footer pt-0')[0].style.display = 'none';

  
      setTimeout(() => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'loadingFinish',
          })
        );
      }, 700)
    }, 1200)
  `;

  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "loadingFinish":
        setIsPostsLoading(false);
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
    }, 500);
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
            source={{ uri: global.URLDEVICE }}
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
