import {
  getCountDataFromLocalStorage,
  getDatafromStorage,
  setCountData,
  setData,
} from "./common";
import {
  AUTO,
  DESKTOP,
  GET_COUNT_DATA_FROM_LOCAL_STORAGE,
  GET_DATA_FROM_STORAGE,
  MOBILE_USER_AGENT,
  SET_COUNT_DATA,
  SET_DATA,
} from "./constants/string.constants";

const data: DataInterface = {
  deviceType: DESKTOP,
  userAgent: MOBILE_USER_AGENT,
  desktopTotal: 35,
  mobileTotal: 25,
  searchMode: AUTO,
};

chrome.runtime.onInstalled.addListener(async function (details) {
  console.log(details.reason);
  if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
    await setData(data);
  }
});

chrome.runtime.onMessage.addListener(async (request) => {
  try {
    switch (request.action) {
      case SET_DATA:
        await setData(request.data);
        break;

      case GET_DATA_FROM_STORAGE:
        await sendMessage(request.action, await getDatafromStorage());
        break;

      case GET_COUNT_DATA_FROM_LOCAL_STORAGE:
        await sendMessage(request.action, {
          data: await getCountDataFromLocalStorage(request.data),
          key: request.data,
        });
        break;

      case SET_COUNT_DATA:
        await setCountData(request.data, request.count);
        break;
    }
  } catch (error) {
    console.error("Error in message listener:", error);
  }
});

const sendMessage = async (action: string, data: any) => {
  try {
    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
      console.log(tabs);

      for (let index = 0; index < tabs.length; index++) {
        const element = tabs[index];
        if (element.id) {
          if (element.url?.indexOf("www.bing.com") !== -1) {
            await chrome.tabs.sendMessage(element.id, {
              action: action,
              data: data,
            });
            console.log("Result Message Send Success");
          }
        } else {
          console.log("Result Message Send Failed");
        }
      }
    });
  } catch (error) {
    console.log("Result Message Send Failed");
    console.log(error);
  }
};
