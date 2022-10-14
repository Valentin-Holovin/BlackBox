import {
  View,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { DASHBOARD_URL, LOGIN_URL } from "../../utils/url";
import { styles } from "./styles";
import { connect } from "react-redux";
import { useCallback } from "react";

const DashboardScreen = ({ navigation, userName, password }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState(DASHBOARD_URL);
  const ref = useRef(null);

  useFocusEffect(
    useCallback(() => {
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
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (ref.current) {
        setUrl(DASHBOARD_URL);
        ref.current.reload();
      }
    }, [])
  );

  const INJECTED_JAVASCRIPT_LOGIN = `
    document.getElementById("Input_Email").value ='${userName}';
    document.getElementById("Input_Password").value ='${password}';
    document.getElementsByClassName("btn btn-primary")[0].click();
  `;

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      try{
        document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
        document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
        document.getElementsByClassName('footer pt-0')[0].style.display = 'none';
        document.getElementsByClassName("btn btn-outline-light text-white p-2")[0].removeAttribute("href");
        document.getElementsByClassName("btn btn-outline-light text-white p-2")[1].removeAttribute("href");
    
        for(let i = 0; i < document.getElementsByClassName('btn btn-default').length; i++){
          document.getElementsByClassName('btn btn-default')[i].addEventListener("click", function(){
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
        }, 700)
      }catch(e){
        setTimeout(() => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'loadingFinish',
            })
          );
        }, 700)
      }

    try{
      document.getElementsByClassName("btn btn-outline-light text-white p-2")[0].addEventListener("click", function(){
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'buttonDesc',
            })
          );
        });
    }catch(e){}

    try{
       document.getElementsByClassName("btn btn-outline-light text-white p-2")[1].addEventListener("click", function(){
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'buttonChart',
            })
          );
        });
    }catch(e){}
    }, 1500)
  `;

  const onScroll = (event) => {
    setIsScrolledToTop(event.nativeEvent.contentOffset.y < 100);
  };

  const getRefreshControl = () => {
    if (!isScrolledToTop) {
      return false;
    }
    return true;
  };

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "buttonDesc":
        navigation.navigate("View Devices");
        break;
      case "buttonChart":
        navigation.navigate("Other Devices");
        break;
      case "buttonChart":
        setCanGoBack(true);
        break;
      case "loadingFinish":
        setIsPostsLoading(false);
        break;
      default: {
      }
    }
  };

  const onNavigationStateChange = (navState) => {
    console.log("navState", navState);
    setIsPostsLoading(true);
    if (navState.url == LOGIN_URL) {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT_LOGIN);
    } else {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }
  };

  return (
    <ScrollView
      // showsHorizontalScrollIndicator={false}
      // showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          enabled={getRefreshControl()}
          onRefresh={() => {
            ref.current.reload();
          }}
        />
      }
    >
      <View
        collapsable={true}
        style={{
          flex: 1,
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
      >
        <View style={styles.webview}>
          <WebView
            nestedScrollEnabled={true}
            collapsable={false}
            source={{ uri: DASHBOARD_URL }}
            ref={ref}
            onNavigationStateChange={onNavigationStateChange}
            tartInLoadingState={true}
            javaScriptEnabled={true}
            onMessage={onMessage}
            onLoadStart={() => setIsPostsLoading(true)}
            onLoad={() => setIsPostsLoading(false)}
            onScroll={onScroll}
            style={{ marginBottom: 30 }}
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

export default connect(mapStateToProps)(DashboardScreen);
