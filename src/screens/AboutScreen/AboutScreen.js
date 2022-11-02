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
import { ABOUT_URL } from "../../utils/url";
import { styles } from "./styles";

const AboutScreen = ({ navigation }) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState(ABOUT_URL);
  const ref = useRef(null);

  React.useEffect(() => {
    BackHandler.removeEventListener("hardwareBackPress", handler);
    const handler = () => {
      ref.current.goBack();
      setCanGoBack(false);

      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);
    navigation.closeDrawer();
    return () => {};
  }, [canGoBack]);

  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (ref.current) {
        setUrl(ABOUT_URL);
        ref.current.reload();
      }
    }, [])
  );

  const INJECTED_JAVASCRIPT = `
      setTimeout(() => {
  
        document.getElementsByClassName('breadcrumb breadcrumb-links breadcrumb-dark')[0].style.display = 'none';
        document.getElementsByClassName("navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom")[0].style.display = "none";
        document.getElementsByClassName('footer pt-0')[0].style.display = 'none';
      
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
            source={{ uri: ABOUT_URL }}
            ref={ref}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            tartInLoadingState={true}
            javaScriptEnabled={true}
            onLoadStart={() => setIsPostsLoading(true)}
            onLoad={() => setIsPostsLoading(false)}
            onScroll={onScroll}
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

export default AboutScreen;
