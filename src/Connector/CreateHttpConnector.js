/**
 * @typedef HyralConnector
 * @type {Object}
 * @property {AxiosInstance} axios - AxiosInstance
 * @property {function} fetch
 * @property {function} create
 * @property {function} update
 * @property {function} delete
 */

import HttpConnector from './HttpConnector';

/**
 * @param {Object} connector
 * @param {AxiosInstance} axios
 * @param {function} urlSerializer
 * @param {function} paramsSerializer
 * @param {function} requestSerializer
 * @param {function} responseNormalizer
 * @returns {HyralConnector}
 */

function createHttpConnector(
  connector,
  axios,
  urlSerializer,
  paramsSerializer,
  requestSerializer,
  responseNormalizer,
) {
  axios.defaults.paramsSerializer = paramsSerializer;
  axios.defaults.transformRequest.push(requestSerializer);
  axios.defaults.transformResponse.push(responseNormalizer);
  return Object.create(connector, {
    axios: {
      writable: false,
      enumerable: false,
      value: axios,
    },
    urlSerializer: {
      writable: false,
      enumerable: false,
      value: urlSerializer,
    },
  });
}

export default createHttpConnector.bind({}, HttpConnector);
