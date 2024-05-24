import {
  DESKTOP,
  DESKTOP_COUNT_KEY,
  DESKTOP_TOTAL_KEY,
  MOBILE,
  MOBILE_COUNT_KEY,
  MOBILE_TOTAL_KEY,
  MOBILE_USER_AGENT,
  MOBILE_USER_AGENT_KEY,
  SEARCH_MODE_KEY,
} from "../constants/string.constants";

enum DeviceTypes {
  mobile,
  desktop,
  auto,
}
function getUserAgentFromStorage(): string {
  const data = localStorage.getItem(MOBILE_USER_AGENT_KEY);
  if (data) {
    return data;
  }
  localStorage.setItem(MOBILE_USER_AGENT_KEY, MOBILE_USER_AGENT);
  return getUserAgentFromStorage();
}

function getDeviceTypeFromStorage(): DeviceTypes {
  const data = localStorage.getItem(SEARCH_MODE_KEY);
  if (data) {
    if (data == MOBILE) {
      return DeviceTypes.mobile;
    } else {
      return DeviceTypes.desktop;
    }
  }
  localStorage.setItem(SEARCH_MODE_KEY, DESKTOP);
  return getDeviceTypeFromStorage();
}

function getCountDataFromLocalStorage(key: string): number {
  const data = localStorage.getItem(key);
  if (data) {
    return Number.parseInt(data);
  }
  switch (key) {
    case MOBILE_COUNT_KEY:
      setCountData(key, 0);
      break;
    case MOBILE_TOTAL_KEY:
      setCountData(key, 25);
      break;
    case DESKTOP_COUNT_KEY:
      setCountData(key, 0);
      break;
    case DESKTOP_TOTAL_KEY:
      setCountData(key, 35);
      break;
    default:
      setCountData(key, 0);
      break;
  }
  return getCountDataFromLocalStorage(key);
}

function setCountData(key: string, count: number): void {
  localStorage.setItem(key, count.toString());
}

export {
  DeviceTypes,
  getDeviceTypeFromStorage,
  getUserAgentFromStorage,
  getCountDataFromLocalStorage,
  setCountData,
};
