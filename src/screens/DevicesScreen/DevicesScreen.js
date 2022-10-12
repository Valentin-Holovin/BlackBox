import {
  View,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { DEVICES_URL, LOGIN_URL } from "../../utils/url";
import { styles } from "./styles";
import { connect } from "react-redux";

const DevicesScreen = ({ navigation, userName, password }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState(DEVICES_URL);
  const ref = useRef(null);

  React.useEffect(() => {
    BackHandler.removeEventListener("hardwareBackPress", handler);
    const handler = () => {
      if (canGoBack) {
        ref.current.goBack();
        setCanGoBack(false);
      } else {
        navigation.goBack();
      }
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);
    navigation.closeDrawer();
    return () => {};
  }, [canGoBack]);

  const [isPostsLoading, setIsPostsLoading] = useState(false);

  const INJECTED_JAVASCRIPT_LOGIN = `
    document.getElementById("Input_Email").value = '${userName}';
    document.getElementById("Input_Password").value = '${password}';
    document.getElementsByClassName("btn btn-primary")[0].click();
  `;

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
      document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
      document.getElementsByClassName('footer pt-0')[0].style.display = 'none';

      for(let i = 0; i < document.getElementsByClassName('btn btn-sm btn-default').length; i++){
        document.getElementsByClassName('btn btn-sm btn-default')[i].addEventListener("click", function(){
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'buttonData',
            })
          );
        });
      }
      
      for(let i = 0; i < document.getElementsByClassName('btn btn-neutral').length; i++){
        document.getElementsByClassName('btn btn-neutral')[i].addEventListener("click", function(){
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'buttonReg',
            })
          );
        });
      }
     
      setTimeout(() => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'loadingFinish',
          })
        );
      }, 600)
    }, 1500)
    
  `;

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }, 600);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  const onScroll = (event) => {
    setIsScrolledToTop(event.nativeEvent.contentOffset.y < 100);
  };

  const getRefreshControl = () => {
    if (!isScrolledToTop) {
      return false;
    }
    return true;
  };

  const onNavigationStateChange = (navState) => {
    setIsPostsLoading(true);
    if (navState.url == LOGIN_URL) {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT_LOGIN);
    } else {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }
  };

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
            onNavigationStateChange={onNavigationStateChange}
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

export default connect(mapStateToProps)(DevicesScreen);
