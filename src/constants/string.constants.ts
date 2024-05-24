const GET_WORDS_URL = "https://random-word-api.herokuapp.com/word?number=";
const today: Date = new Date();
const countKey: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

const SEARCH_MODE_KEY: string = "search-mode";
const MOBILE: string = "mobile";
const DESKTOP: string = "desktop";
const AUTO: string = "auto";

// mobile
const MOBILE_TOTAL_KEY: string = `${MOBILE}-count`;
const MOBILE_COUNT_KEY: string = `${MOBILE}-${countKey}`;
const MOBILE_USER_AGENT_KEY: string = "mobile-user-agent";
const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1";

// desktop
const DESKTOP_TOTAL_KEY: string = `${DESKTOP}-count`;
const DESKTOP_COUNT_KEY: string = `${DESKTOP}-${countKey}`;

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
};
