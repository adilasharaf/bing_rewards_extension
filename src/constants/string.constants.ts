const GET_WORDS_URL = "https://random-word-api.herokuapp.com/word?number=";
const today: Date = new Date();
const countKey: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

const SEARCH_MODE_KEY: string = "search_mode";
const MOBILE: string = "mobile";
const DESKTOP: string = "desktop";
const AUTO: string = "auto";
const DEVICE_TYPE_KEY = "device_type";

const SET_USER_AGENT = "setUserAgent";
const GET_USER_AGENT_FROM_STORAGE = "getUserAgentFromStorage";
const GET_SEARCH_TYPE_FROM_STORAGE = "getSearchTypeFromStorage";
const GET_COUNT_DATA_FROM_LOCAL_STORAGE = "getCountDataFromLocalStorage";
const SET_COUNT_DATA = "setCountData";
const GET_DEVICE_TYPE_FROM_STORAGE = "getDeviceTypeFromStorage";
// mobile
const MOBILE_TOTAL_KEY: string = `${MOBILE}_count`;
const MOBILE_COUNT_KEY: string = `${MOBILE}_${countKey}`;
const MOBILE_USER_AGENT_KEY: string = "mobile_user_agent";
const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1";

// desktop
const DESKTOP_TOTAL_KEY: string = `${DESKTOP}_count`;
const DESKTOP_COUNT_KEY: string = `${DESKTOP}_${countKey}`;
const DESKTOP_USER_AGENT: string =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
export {
  GET_WORDS_URL,
  SEARCH_MODE_KEY,
  MOBILE,
  DESKTOP,
  AUTO,
  MOBILE_USER_AGENT_KEY,
  MOBILE_USER_AGENT,
  MOBILE_COUNT_KEY,
  MOBILE_TOTAL_KEY,
  DESKTOP_COUNT_KEY,
  DESKTOP_TOTAL_KEY,
  DESKTOP_USER_AGENT,
  DEVICE_TYPE_KEY,
  SET_USER_AGENT,
  GET_USER_AGENT_FROM_STORAGE,
  GET_SEARCH_TYPE_FROM_STORAGE,
  GET_COUNT_DATA_FROM_LOCAL_STORAGE,
  SET_COUNT_DATA,
  GET_DEVICE_TYPE_FROM_STORAGE
};
