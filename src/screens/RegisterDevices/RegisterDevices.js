import {
  View,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";

const RegisterDevices = ({ navigation, userName, password }) => {
  const [canGoBack, setCanGoBack] = useState(false);

  const ref = useRef(null);

  React.useEffect(() => {
    BackHandler.removeEventListener("hardwareBackPress", handler);
    const handler = () => {
      if (canGoBack) {
        ref.current.goBack();
        setCanGoBack(true);
      } else {
        navigation.goBack();
      }

      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);
    navigation.closeDrawer();
    return () => {};
  }, [canGoBack]);

  const DEVICES_URL = "https://www.tanklevels.co.uk/devices/register-device";
  const LOGIN_URL = "https://www.tanklevels.co.uk/login";

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
       
        setTimeout(() => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'loadingFinish',
            })
          );
        }, 500)
      }, 1500)
    `;

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "buttonData":
        setCanGoBack(false);
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

export default connect(mapStateToProps)(RegisterDevices);
