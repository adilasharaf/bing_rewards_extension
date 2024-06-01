import { getDatafromStorage } from "../constants/function.constants";
import { DEVICE_TYPES, SEARCH_MODES } from "../constants/array.constants";
import {
  BUTTON_PRESS,
  DESKTOP,
  DEVICE_TYPE,
  MOBILE,
  OPTION,
  SEARCH_MODE,
  SUBMIT_BUTTON,
  TIME,
  USER_AGENT,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";

const mobileSelect: HTMLSelectElement = document.getElementById(
  MOBILE
) as HTMLSelectElement;

const desktopSelect: HTMLSelectElement = document.getElementById(
  DESKTOP
) as HTMLSelectElement;

const modeSelect: HTMLSelectElement = document.getElementById(
  SEARCH_MODE
) as HTMLSelectElement;

const deviceSelect: HTMLSelectElement = document.getElementById(
  DEVICE_TYPE
) as HTMLSelectElement;

const timeSelect: HTMLSelectElement = document.getElementById(
  TIME
) as HTMLSelectElement;

const userAgentInput: HTMLInputElement = document.getElementById(
  USER_AGENT
) as HTMLInputElement;

const sumbitButton: HTMLButtonElement = document.getElementById(
  SUBMIT_BUTTON
) as HTMLButtonElement;

let contentData: DataInterface;

async function populateItems() {
  contentData = await getDatafromStorage();
  if (!contentData) {
    setTimeout(async () => {
      await populateItems();
    }),
      1000;
  } else {
    if (mobileSelect) {
      for (let i = 0; i < 100; i++) {
        const option: HTMLOptionElement = document.createElement(OPTION);
        option.value = i.toString();
        option.text = i.toString();
        mobileSelect.appendChild(option);
      }

      mobileSelect.value = contentData.mobileTotal.toString();
    }

    if (desktopSelect) {
      for (let i = 0; i < 100; i++) {
        const option: HTMLOptionElement = document.createElement(OPTION);
        option.value = i.toString();
        option.text = i.toString();
        desktopSelect.appendChild(option);
      }
      desktopSelect.value = contentData.desktopTotal.toString();
    }

    if (modeSelect) {
      for (let i = 0; i < SEARCH_MODES.length; i++) {
        const option: HTMLOptionElement = document.createElement(OPTION);
        option.value = SEARCH_MODES[i];
        option.text = SEARCH_MODES[i];
        modeSelect.appendChild(option);
      }
      modeSelect.value = contentData.searchMode;
    }

    if (deviceSelect) {
      for (let i = 0; i < DEVICE_TYPES.length; i++) {
        const option: HTMLOptionElement = document.createElement(OPTION);
        option.value = SEARCH_MODES[i];
        option.text = SEARCH_MODES[i];
        deviceSelect.appendChild(option);
      }
      deviceSelect.value = contentData.deviceType;
    }

    if (timeSelect) {
      for (let i = 0; i < 100; i++) {
        const option: HTMLOptionElement = document.createElement(OPTION);
        option.value = i.toString();
        option.text = `${i} s`;
        timeSelect.appendChild(option);
      }
      timeSelect.value = contentData.time.toString();
    }

    if (userAgentInput) {
      userAgentInput.value = contentData.userAgent;
    }
  }
}

async function handleClick() {
  chrome.runtime.sendMessage({
    method: BUTTON_PRESS,
    data: {
      ...contentData,
      mobileTotal: Number.parseInt(mobileSelect.value),
      userAgent: userAgentInput.value,
      desktopTotal: Number.parseInt(desktopSelect.value),
      searchMode: modeSelect.value,
      deviceType: deviceSelect.value,
      time: timeSelect.value,
    },
  });
}

populateItems();
sumbitButton.addEventListener("click", handleClick);
