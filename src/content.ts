"use strict";
import { WORDS } from "./constants/array.constants";
import {
  AUTO,
  DESKTOP,
  DESKTOP_COUNT_KEY,
  DESKTOP_USER_AGENT,
  GET_COUNT_DATA_FROM_LOCAL_STORAGE,
  GET_DATA_FROM_STORAGE,
  GET_WORDS_URL,
  MOBILE,
  MOBILE_COUNT_KEY,
  MOBILE_USER_AGENT,
  SET_COUNT_DATA,
  SET_DATA,
} from "./constants/string.constants";

let contentData: DataInterface;
let mobileCount: number;
let desktopCount: number;
// functions

chrome.runtime.onMessage.addListener((request, _, response) => {
  // console.log(request);
  switch (request.action) {
    case GET_DATA_FROM_STORAGE:
      contentData = request.data;
      console.log(`Content Data :  ${contentData}`);
      break;

    case GET_COUNT_DATA_FROM_LOCAL_STORAGE:
      switch (request.data.key) {
        case MOBILE_COUNT_KEY:
          mobileCount = request.data.data;
          console.log(`Mobile count :  ${mobileCount}`);
          break;

        case DESKTOP_COUNT_KEY:
          desktopCount = request.data.data;
          console.log(`Desktop count :  ${desktopCount}`);
          break;

        default:
          console.log(request);
          break;
      }
      break;
  }
});

async function sendMessage(
  action: string,
  data?: DataInterface | string,
  count?: number
) {
  await chrome.runtime.sendMessage({
    action: action,
    data: data,
    count: count,
  });
}

// Function to get a random word from the list
async function getRandomWord(): Promise<string> {
  try {
    const response = await fetch(GET_WORDS_URL + 1);
    const data = await response.json();
    console.log(data);
    return data[0];
  } catch (error) {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }
}

async function getRandomDeviceType(): Promise<string | undefined> {
  if (contentData.searchMode != AUTO) {
    return contentData.searchMode;
  }
  const deviceTypes: string[] = [
    MOBILE,
    DESKTOP,
  ];
  let randomDevice: string =
    deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
  console.log(`Random Device Before: ${randomDevice}`);

  if (randomDevice == MOBILE) {
    if (mobileCount == contentData.mobileTotal) {
      randomDevice = DESKTOP;
    }
  }
  if (randomDevice == DESKTOP) {
    if (desktopCount == contentData.desktopTotal) {
      randomDevice = MOBILE;
    }
  }
  console.log(`Random Device After: ${randomDevice}`);

  await sendMessage(SET_DATA);
  if (randomDevice == MOBILE) {
    await sendMessage(SET_DATA, {
      ...contentData,
      userAgent: MOBILE_USER_AGENT,
    });
  } else {
    await sendMessage(SET_DATA, {
      ...contentData,
      userAgent: DESKTOP_USER_AGENT,
    });
  }
}

// Function to type out each character with a delay
async function typeSearchTerm(
  searchTerm: string,
  searchBox: HTMLInputElement,
  seachFunction: Function
) {
  await getRandomDeviceType();
  searchBox.value = ""; // Clear the search box before typing
  let i = 0;
  const typingDelay = 1000; // Delay in milliseconds between keystrokes
  const interval = setInterval(async () => {
    if (i < searchTerm.length) {
      searchBox.value += searchTerm.charAt(i);
      i++;
    } else {
      if (contentData.deviceType == DESKTOP) {
        await sendMessage(SET_COUNT_DATA, DESKTOP_COUNT_KEY, desktopCount + 1);
      } else {
        await sendMessage(SET_COUNT_DATA, MOBILE_COUNT_KEY, mobileCount + 1);
      }
      seachFunction();
      clearInterval(interval);
    }
  }, typingDelay);
}

// Function to perform the search with typing effect
async function performSearch() {
  const searchBox: HTMLInputElement = document.getElementById(
    "sb_form_q"
  ) as HTMLInputElement;

  const searchForm: HTMLFormElement = document.getElementById(
    "sb_form"
  ) as HTMLFormElement;

  if (!searchBox && !searchForm) {
    console.log("Search Not Avaliable");
    return;
  }

  // get search term
  const searchTerm = await getRandomWord();
  console.log(`Random generated word : ${searchTerm}`);

  // focus and click search box
  searchBox.focus();
  searchBox.click();

  // focus and click search form
  searchForm.focus();
  searchForm.click();

  const searchButton: HTMLLabelElement = document.getElementById(
    "sb_form_go"
  ) as HTMLLabelElement;

  if (searchButton) {
    await typeSearchTerm(searchTerm, searchBox, async () => {
      searchButton.click();
    });
  } else {
    console.log("No Search Button");
    const searchIcon: HTMLLabelElement = document.getElementById(
      "search_icon"
    ) as HTMLLabelElement;

    if (searchIcon) {
      await typeSearchTerm(searchTerm, searchBox, async () => {
        searchIcon.click();
      });
    } else {
      console.log("No Search Icon");
      await typeSearchTerm(searchTerm, searchBox, async () => {
        searchForm.submit();
      });
    }
  }
}

async function startSearch() {
  setTimeout(async () => {
    if (
      mobileCount != contentData.mobileTotal &&
      desktopCount != contentData.desktopTotal
    ) {
      await performSearch();
    }
  }, Math.floor(Math.random() * (16000 - 10000 + 1)) + 10000);
}

async function init() {
  await sendMessage(GET_DATA_FROM_STORAGE);
  await sendMessage(GET_COUNT_DATA_FROM_LOCAL_STORAGE, MOBILE_COUNT_KEY);
  await sendMessage(GET_COUNT_DATA_FROM_LOCAL_STORAGE, DESKTOP_COUNT_KEY);

  if (mobileCount && desktopCount && contentData) {
    console.log("Starting Search : Success");
    await startSearch();
  } else {
    console.log("Starting Search : Failed");
    setTimeout(async () => {
      await init();
    }, 5000);
  }
}

// starting extension
init();
