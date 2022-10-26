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
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
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

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      ref.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (ref.current) {
        console.log("DASHBOARD_URL", DASHBOARD_URL);
        setUrl(DASHBOARD_URL);
        ref.current.reload();
      }
    }, [])
  );

  const onScroll = (event) => {
    setIsScrolledToTop(event.nativeEvent.contentOffset.y < 100);
  };

  const getRefreshControl = () => {
    if (!isScrolledToTop) {
      return false;
    }
    return true;
  };

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

        var links = document.getElementsByClassName('btn btn-neutral text-dark p-2');
        for(var i = 0; i < links.length; i++){
          for(var i = 0; i < links.length; i++){
          let atag = links[i];
          if(atag.href != 'javascript:;'){
            atag.chref=atag.href;
            atag.href = 'javascript:;';
            atag.cName=atag.innerText;
            console.log(atag.chref);
          }
          }
        }

      try{
          document.addEventListener('click', function(evt) {
            if(('' + evt.target.chref).includes('www.tanklevels.co.uk/devices/')){
              evt.preventDefault()
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'nextScreen',
                  link: evt.target.chref,
                  name: evt.target.cName,
                })
              );
         }
        }, false);
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
    }, 600)
  `;

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "loadingFinish":
        setIsPostsLoading(false);
        break;
      case "nextScreen":
        data.link;
        global.URLDEVICE = data.link;
        console.log("LINK", global.URLDEVICE);
        global.prevScreen = url;
        data.name;
        global.DEVICENAME = data.name;
        console.log("Name => ", data.name);
        navigation.navigate("View Devices");
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
            injectedJavaScript={INJECTED_JAVASCRIPT}
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
