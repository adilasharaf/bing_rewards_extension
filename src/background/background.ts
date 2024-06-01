import {
  AUTO,
  DESKTOP_COUNT_KEY,
  GET_DATA_FROM_STORAGE,
  GET_DESKTOP_COUNT,
  GET_MOBILE_COUNT,
  MOBILE,
  MOBILE_COUNT_KEY,
  MOBILE_USER_AGENT,
  SET_DATA,
  SET_DESKTOP_COUNT,
  SET_MOBILE_COUNT,
  SET_SUCCESS,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";
import { RequestInterface } from "../interface/request.interface";
import {
  consoleRequest,
  getDatafromStorage,
  getCountFromStorage,
  setCountData,
  setData,
  setSuccess,
  setDataAndChangeUA,
} from "../constants/function.constants";

const data: DataInterface = {
  deviceType: MOBILE,
  userAgent: MOBILE_USER_AGENT,
  desktopTotal: 35,
  mobileTotal: 25,
  searchMode: AUTO,
  time: 10,
};
chrome.runtime.onInstalled.addListener(async function (details) {
  console.log(details.reason);
  if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
    await setData(data);
  } else if (details.reason == chrome.runtime.OnInstalledReason.UPDATE) {
    await setData(data);
  }
});

chrome.runtime.onMessage.addListener(async (request: RequestInterface) => {
  try {
    switch (request.method) {
      case GET_DATA_FROM_STORAGE:
        await sendMessage(
          request.method,
          (await getDatafromStorage()) as DataInterface
        );
        break;

      case GET_MOBILE_COUNT:
        await sendMessage(
          GET_MOBILE_COUNT,
          (await getCountFromStorage(MOBILE_COUNT_KEY)) as number,
          MOBILE_COUNT_KEY
        );
        break;

      case GET_DESKTOP_COUNT:
        await sendMessage(
          GET_DESKTOP_COUNT,
          (await getCountFromStorage(DESKTOP_COUNT_KEY)) as number,
          DESKTOP_COUNT_KEY
        );
        break;

      case SET_MOBILE_COUNT:
        await setCountData(MOBILE_COUNT_KEY, request.data as number);
        break;

      case SET_DESKTOP_COUNT:
        await setCountData(DESKTOP_COUNT_KEY, request.data as number);
        break;

      case SET_DATA:
        await setData(request.data as DataInterface);
        break;

      case SET_SUCCESS:
        await setSuccess(
          request.data.contentData as DataInterface,
          request.data.mobileCount as number,
          request.data.desktopCount as number
        );
        break;

      default:
        await setDataAndChangeUA(request.data as DataInterface).then(
          async () => {
            await chrome.tabs.create({
              url: "https://www.bing.com",
              active: true,
            });
          }
        );
        return;
    }
  } catch (error) {
    console.error("Error in message listener:", error);
  }
});

const sendMessage = async (
  method: string,
  data: DataInterface | number | undefined,
  key?: string
) => {
  try {
    chrome.tabs.query({}, async (tabs) => {
      for (let index = 0; index < tabs.length; index++) {
        const element = tabs[index];
        if (element.id) {
          if (element.url?.indexOf("www.bing.com") !== -1) {
            consoleRequest({ method: method, data: data, key: key });

            await chrome.tabs.sendMessage(element.id, {
              method: method,
              data: data,
              key: key,
            } as RequestInterface);
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
