import { core } from "../background/core";
import {
  AUTO,
  DATA_KEY,
  DESKTOP,
  DESKTOP_COUNT_KEY,
  MOBILE,
  MOBILE_COUNT_KEY,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";

async function getDatafromStorage(): Promise<DataInterface | any> {
  const data = await chrome.storage.local.get(DATA_KEY);
  // console.log(data[DATA_KEY]);
  if (data[DATA_KEY]) {
    return data[DATA_KEY] as DataInterface;
  }
}

async function getCountFromStorage(key: string): Promise<any> {
  const data = await chrome.storage.local.get(key);
  if (data[key]) {
    // console.log(data[key]);
    return data[key];
  }
  await setCountData(key, 1);
  return getCountFromStorage(key);
}

async function setCountData(key: string, count: number) {
  // console.log({ key: key, count: count });
  return await chrome.storage.local.set({ [key]: count });
}

async function setData(data: DataInterface) {
  // console.log(data);
  return await chrome.storage.local.set({ [DATA_KEY]: data });
}

function consoleRequest(request: any) {
  console.log({
    method: request.method,
    data: request.data,
    key: request.key,
  });
}

async function setSuccess(
  contentData: DataInterface,
  mobileCount: number,
  desktopCount: number
) {
  if (contentData.deviceType == MOBILE) {
    await setCountData(MOBILE_COUNT_KEY, mobileCount + 1);
  } else {
    await setCountData(DESKTOP_COUNT_KEY, desktopCount + 1);
  }
  if (contentData.searchMode === AUTO) {
    let randomDevice = MOBILE;
    if (contentData.deviceType === MOBILE) {
      if (mobileCount == contentData.mobileTotal) {
        randomDevice = DESKTOP;
      }
    } else {
      randomDevice = DESKTOP;
      if (desktopCount == contentData.desktopTotal) {
        randomDevice = MOBILE;
      }
    }

    console.log(`Random Device: ${randomDevice}`);

    await setData({ ...contentData, deviceType: randomDevice! });

    await core.action.changeUA(contentData);
  }
}

async function setDataAndChangeUA(contentData: DataInterface) {
  await setData(contentData);
  await core.action.changeUA(contentData);
}
export {
  setCountData,
  getDatafromStorage,
  setData,
  consoleRequest,
  setSuccess,
  getCountFromStorage,
  setDataAndChangeUA,
};
