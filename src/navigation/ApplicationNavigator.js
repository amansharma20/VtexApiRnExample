import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import {ThemeProvider} from '@shopify/restyle';
import {lightTheme} from '@atoms';
import {Provider} from 'react-redux';
import RootStore from '../redux/RootStore';
import CommonLoading from '../components/CommonLoading';
import Toast from 'react-native-toast-message';

export default function ApplicationNavigator() {
  const routeNameRef = useRef('');
  const navigationRef = useRef(null);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name || '';
        if (previousRouteName !== currentRouteName) {
          console.log('currentRouteName: ', currentRouteName);
        }
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}>
      <Provider store={RootStore}>
        <ThemeProvider theme={lightTheme}>
          <StackNavigator />
        </ThemeProvider>
      </Provider>
      <CommonLoading ref={ref => CommonLoading.setRef(ref)} />
      <Toast />
    </NavigationContainer>
  );
}
