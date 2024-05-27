import {
  DATA_KEY,
  DESKTOP_COUNT_KEY,
  MOBILE_COUNT_KEY,
  MOBILE_USER_AGENT,
} from "../src/constants/string.constants";

async function getDatafromStorage(): Promise<DataInterface | any> {
  const data = await chrome.storage.local.get(DATA_KEY);
  console.log(data[DATA_KEY]);
  if (data[DATA_KEY]) {
    return data[DATA_KEY] as DataInterface;
  }
}

async function getCountDataFromLocalStorage(key: string): Promise<number> {
  const data = await chrome.storage.local.get(key);
  if (data[key]) {
    console.log(data[key]);
    return data[key];
  }
  switch (key) {
    case MOBILE_COUNT_KEY:
      await setCountData(key, 1);
      return getCountDataFromLocalStorage(key);

    case DESKTOP_COUNT_KEY:
      await setCountData(key, 1);
      return getCountDataFromLocalStorage(key);

    default:
      await setCountData(key, 1);
      return getCountDataFromLocalStorage(key);
  }
}

async function setCountData(key: string, count: number) {
  console.log({ key: key, count: count });
  return await chrome.storage.local.set({ [key]: count });
}

async function setData(data: DataInterface) {
  console.log(data);
  return await chrome.storage.local.set({ [DATA_KEY]: data });
}

// user-agent
async function setUserAgent(key?: string, append?: boolean) {
  try {
    console.log(`Request User Agent : ${key}`);
    const userAgent = key ?? MOBILE_USER_AGENT;
    const headerRules = {
      addRules: [
        {
          id: 1000,
          priority: 2,
          action: {
            type: "modifyHeaders" as chrome.declarativeNetRequest.RuleActionType,
            requestHeaders: [
              {
                header: "user-agent",
                operation: append
                  ? ("append" as chrome.declarativeNetRequest.HeaderOperation)
                  : ("set" as chrome.declarativeNetRequest.HeaderOperation),
                value: append ? `${userAgent}` : userAgent,
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
    await chrome.declarativeNetRequest.updateSessionRules(headerRules);
    console.log("SetUserAgent Success");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  getCountDataFromLocalStorage,
  setCountData,
  setUserAgent,
  getDatafromStorage,
  setData,
};
