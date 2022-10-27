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
import { DEVICES_URL } from "../../utils/url";
import { styles } from "./styles";
import { connect } from "react-redux";

const DevicesScreen = ({ navigation }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  const [url, setUrl] = useState(DEVICES_URL);
  const ref = useRef(null);

  global.DEVICENAME = "";

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
    }, 600);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onScroll = (event) => {
    setIsScrolledToTop(event.nativeEvent.contentOffset.y < 100);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (ref.current) {
        setUrl(DEVICES_URL);
        ref.current.reload();
      }
    }, [])
  );

  const getRefreshControl = () => {
    if (!isScrolledToTop) {
      return false;
    }
    return true;
  };

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
      document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
      document.getElementsByClassName('footer pt-0')[0].style.display = 'none';

        var links = document.getElementsByClassName('btn btn-sm btn-default');
        for(var i = 0; i < links.length; i++){
          for(var i = 0; i < links.length; i++){
          let atag = links[i];
          if(atag.href != 'javascript:;'){
            atag.chref = atag.href;
            atag.href = 'javascript:;';
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
                })
              );
          }
          }, false);
        }catch(e){}
      
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
      }, 500)
    }, 1000)
    
  `;

  const onMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case "loadingFinish":
        setIsPostsLoading(false);
        break;
      case "nextScreen":
        console.log("nextScreen");
        navigation.navigate("View Devices");
        data.link;
        global.URLDEVICE = data.link;
        global.prevScreen = DEVICES_URL;
        break;
      case "buttonReg":
        setCanGoBack(true);
        break;
      default: {
      }
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

export default connect(mapStateToProps)(DevicesScreen);
