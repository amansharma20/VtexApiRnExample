import {useContext} from 'react';
import {AuthContext} from '../navigation/StackNavigator';

export const useIsUserLoggedIn = () => {
  const {state} = useContext(AuthContext);

  const isUserLoggedIn = state.userToken ? true : false;

  return {isUserLoggedIn};
};
