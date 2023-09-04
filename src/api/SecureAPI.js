import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {applicationProperties} from '../utils/application.properties';

const get = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }

  try {
    let response = await axios.get(applicationProperties.baseUrl + endPoint, {
      headers: {
        Authorization: token,
      },
      validateStatus: () => true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: true,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const getWithUrl = async (url, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }

  try {
    let response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
      validateStatus: () => true,
    });

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: true,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const post = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.post(
      applicationProperties.baseUrl + endPoint,
      data,
      {
        headers: {
          Authorization: token,
        },
        validateStatus: () => true,
      },
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const Delete = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    // console.log(applicationProperties.baseUrl + endPoint);
    // return false;
    let response = await axios.delete(
      applicationProperties.baseUrl + endPoint,
      {
        headers: {
          Authorization: token,
        },
        validateStatus: () => true,
      },
      data,
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const put = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.put(
      applicationProperties.baseUrl + endPoint,
      data,
      {
        headers: {
          Authorization: token,
        },
        validateStatus: () => true,
      },
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

const patch = async (endPoint, data, loading) => {
  let userToken = await Keychain.getGenericPassword();
  let token = userToken.password;
  if (loading) {
    console.log('loading: ', loading);
  }
  try {
    let response = await axios.patch(
      applicationProperties.baseUrl + endPoint,
      data,
      {
        headers: {
          Authorization: token,
          Accept: 'application/json',
        },
        validateStatus: () => true,
      },
    );

    if (response.data !== undefined && response.data.status) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  } finally {
    if (loading) {
      console.log('loading: ', loading);
    }
  }
};

export const api = {
  post,
  get,
  getWithUrl,
  put,
  Delete,
  patch,
};
