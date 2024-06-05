const GET_WORDS_URL = "https://random-word-api.herokuapp.com/word?number=";
const today: Date = new Date();

// const SEARCH_MODE_KEY: string = "search_mode";
const DESKTOP: string = "desktop";
const MOBILE: string = "mobile";
const AUTO: string = "auto";

const SET_MOBILE_COUNT = "setMobileCount";
const GET_MOBILE_COUNT = "getMobileCount";
const GET_DESKTOP_COUNT = "getDesktopCount";
const BUTTON_PRESS = "buttonPress";
const SET_SUCCESS = "setSuccess";
const SET_DESKTOP_COUNT = "setDesktopCount";
const SET_DATA = "setData";
const GET_DATA_FROM_STORAGE = "getDatafromStorage";

const countKey: string = `${today.getDate()}_${today.getMonth()}_${today.getFullYear()}`;
const DATA_KEY = "data_key";
const MOBILE_COUNT_KEY: string = `${MOBILE}_${countKey}`;
const DESKTOP_COUNT_KEY: string = `${DESKTOP}_${countKey}`;

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1";

const SEARCH_MODE = "search-mode";
const DEVICE_TYPE = "device-type";
const TIME = "time";
const USER_AGENT = "user-agent";
const SUBMIT_BUTTON = "submit-button";
const OPTION = "option";
const PACAKGE = "package";
const CONSTANT = "constant";

// desktop

export {
  GET_WORDS_URL,
  MOBILE,
  DESKTOP,
  AUTO,
  MOBILE_COUNT_KEY,
  DESKTOP_COUNT_KEY,
  GET_MOBILE_COUNT,
  GET_DESKTOP_COUNT,
  SET_MOBILE_COUNT,
  SET_DATA,
  GET_DATA_FROM_STORAGE,
  DATA_KEY,
  MOBILE_USER_AGENT,
  SET_DESKTOP_COUNT,
  BUTTON_PRESS,
  SET_SUCCESS,
  SEARCH_MODE,
  DEVICE_TYPE,
  USER_AGENT,
  TIME,
  SUBMIT_BUTTON,
  OPTION,
  PACAKGE,
  CONSTANT,
};
