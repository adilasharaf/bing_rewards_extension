import {
  getCountDataFromLocalStorage,
  getDeviceTypeFromStorage,
  getSearchTypeFromStorage,
  getUserAgentFromStorage,
  setCountData,
  setUserAgent,
} from "./common";
import {
  GET_COUNT_DATA_FROM_LOCAL_STORAGE,
  GET_DEVICE_TYPE_FROM_STORAGE,
  GET_SEARCH_TYPE_FROM_STORAGE,
  GET_USER_AGENT_FROM_STORAGE,
  SET_COUNT_DATA,
  SET_USER_AGENT,
} from "./constants/string.constants";

chrome.runtime.onMessage.addListener(async (request) => {
  try {
    if ((request.message = "action")) {
      let data;
      switch (request.action) {
        case SET_USER_AGENT:
          data = await setUserAgent(request.key);

        case GET_USER_AGENT_FROM_STORAGE:
          data = await getUserAgentFromStorage();

        case GET_SEARCH_TYPE_FROM_STORAGE:
          data = await getSearchTypeFromStorage();

        case GET_COUNT_DATA_FROM_LOCAL_STORAGE:
          data = {
            data: await getCountDataFromLocalStorage(request.key),
            key: request.key,
          };

        case SET_COUNT_DATA:
          data = await setCountData(request.key, request.count);

        case GET_DEVICE_TYPE_FROM_STORAGE:
          data = await getDeviceTypeFromStorage();
      }

      await sendMessage(request.action, data, request.tabId);
    }
  } catch (error) {
    console.error("Error in message listener:", error);
  }
});

const sendMessage = async (action: string, data: any, tabId: number) => {
  try {
    await chrome.tabs.sendMessage(tabId, {
      message: "result",
      action: action,
      data: data,
    });
    console.log("Result Message Send Success");
  } catch (error) {
    console.log("Result Message Send Failed");
    console.log(error);
  }
};
