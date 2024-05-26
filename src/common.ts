import {
  AUTO,
  DESKTOP,
  DESKTOP_COUNT_KEY,
  DESKTOP_TOTAL_KEY,
  DEVICE_TYPE_KEY,
  MOBILE_COUNT_KEY,
  MOBILE_TOTAL_KEY,
  MOBILE_USER_AGENT,
  MOBILE_USER_AGENT_KEY,
  SEARCH_MODE_KEY,
} from "../src/constants/string.constants";

async function getUserAgentFromStorage(): Promise<string> {
  const data = await chrome.storage.local.get(MOBILE_USER_AGENT_KEY);
  console.log(data[MOBILE_USER_AGENT_KEY]);
  if (data[MOBILE_USER_AGENT_KEY]) {
    return data[MOBILE_USER_AGENT_KEY];
  }
  await chrome.storage.local.set({
    [MOBILE_USER_AGENT_KEY]: MOBILE_USER_AGENT,
  });
  return getUserAgentFromStorage();
}

async function getSearchTypeFromStorage(): Promise<string> {
  const data = await chrome.storage.local.get(SEARCH_MODE_KEY);
  if (data[SEARCH_MODE_KEY]) {
    console.log(data[SEARCH_MODE_KEY]);
    return data[SEARCH_MODE_KEY];
  }
  await chrome.storage.local.set({ [SEARCH_MODE_KEY]: AUTO });
  return getSearchTypeFromStorage();
}

async function getCountDataFromLocalStorage(key: string): Promise<number> {
  const data = await chrome.storage.local.get(key);
  if (data[key]) {
    console.log(data[key]);
    return data[key];
  }
  switch (key) {
    case MOBILE_COUNT_KEY:
      await setCountData(key, 0);
    case MOBILE_TOTAL_KEY:
      await setCountData(key, 25);
    case DESKTOP_COUNT_KEY:
      await setCountData(key, 0);
    case DESKTOP_TOTAL_KEY:
      await setCountData(key, 35);
    default:
      await setCountData(key, 0);
  }
  return getCountDataFromLocalStorage(key);
}

async function setCountData(key: string, count: number) {
  await chrome.storage.local.set({ [key]: count });
}

async function getDeviceTypeFromStorage(): Promise<string> {
  const data = await chrome.storage.local.get(DEVICE_TYPE_KEY);
  if (data[DEVICE_TYPE_KEY]) {
    console.log(data[DEVICE_TYPE_KEY]);
    return data[DEVICE_TYPE_KEY];
  }
  await chrome.storage.local.set({ [DEVICE_TYPE_KEY]: DESKTOP });
  return getDeviceTypeFromStorage();
}

async function setUserAgent(key?: string) {
  try {
    console.log(`Request User Agent : ${key}`);
    const userAgent = key ?? MOBILE_USER_AGENT;
    const headerRules = {
      addRules: [
        {
          id: 23525,
          priority: 2,
          action: {
            type: "modifyHeaders" as chrome.declarativeNetRequest.RuleActionType,
            requestHeaders: [
              {
                header: "user-agent",
                operation:
                  "set" as chrome.declarativeNetRequest.HeaderOperation,
                value: userAgent,
              },
            ],
          },
          condition: {
            urlFilter: "https://www.bing.com/*",
            resourceTypes: [
              "main_frame" as chrome.declarativeNetRequest.ResourceType,
              "xmlhttprequest" as chrome.declarativeNetRequest.ResourceType,
            ],
          },
        },
      ],
    };

    await chrome.declarativeNetRequest.updateDynamicRules(headerRules);
    console.log("SetUserAgent Success");
  } catch (error) {
    console.log(error);
  }
}

export {
  getSearchTypeFromStorage,
  getUserAgentFromStorage,
  getCountDataFromLocalStorage,
  setCountData,
  getDeviceTypeFromStorage,
  setUserAgent,
};
