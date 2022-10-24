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

const DashboardScreen = ({ navigation, userName, password }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState(DASHBOARD_URL);
  const ref = useRef(null);

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
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
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

      document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
      document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
      document.getElementsByClassName('footer pt-0')[0].style.display = 'none';

      try{
        try{
           document.getElementsByClassName("btn btn-neutral text-dark p-2")[0].addEventListener("click", function(){
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'nextScreen',
                  link: 'https://www.tanklevels.co.uk/devices/Dw9ZOYM0OQ3g',
                })
              );
            });
        }catch(e){}

        try{
          document.querySelectorAll('.btn btn-neutral text-dark p-2 a')[0].addEventListener("click", function(){
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'linkScreen',
                  link: 'https://www.tanklevels.co.uk/devices/',
                })
              );
            });
        }catch(e){}

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

    
    }, 1000)
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
      case "loadingFinish":
        setIsPostsLoading(false);
        break;
      case "nextScreen":
        setCanGoBack(true);
        break;
      case "linkScreen":
        let link = data.link;
        console.log("link", link);
        setCanGoBack(true);
        break;
      default: {
      }
    }
  };

  const onNavigationStateChange = (navState) => {
    setIsPostsLoading(true);
    if (navState.url == LOGIN_URL) {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT_LOGIN);
    } else {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }
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
            incognito={true}
            style={{ marginBottom: 40 }}
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
