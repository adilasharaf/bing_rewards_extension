"use strict";
import { WORDS } from "./constants/array.constants";
import {
  AUTO,
  DESKTOP,
  DESKTOP_COUNT_KEY,
  DESKTOP_TOTAL_KEY,
  DESKTOP_USER_AGENT,
  GET_COUNT_DATA_FROM_LOCAL_STORAGE,
  GET_DEVICE_TYPE_FROM_STORAGE,
  GET_SEARCH_TYPE_FROM_STORAGE,
  GET_USER_AGENT_FROM_STORAGE,
  GET_WORDS_URL,
  MOBILE,
  MOBILE_COUNT_KEY,
  MOBILE_TOTAL_KEY,
  SET_COUNT_DATA,
  SET_USER_AGENT,
} from "./constants/string.constants";

let searchMode: string;
let deviceType: string;
let userAgent: string;

// mobile
let mobileCount: number;
let mobileTotal: number;

// desktop
let desktopCount: number;
let desktopTotal: number;

// functions
chrome.runtime.onMessage.addListener((request, _, response) => {
  console.log(request);
  if (request.message == "result") {
    switch (request.action) {
      case GET_SEARCH_TYPE_FROM_STORAGE:
        searchMode = request.data;
        console.log(`Search mode :  ${searchMode}`);
        break;

      case GET_USER_AGENT_FROM_STORAGE:
        userAgent = request.data;
        console.log(`User Agent :  ${userAgent}`);
        break;

      case GET_COUNT_DATA_FROM_LOCAL_STORAGE:
        switch (request.data.key) {
          case MOBILE_COUNT_KEY:
            mobileCount = request.data.data;
            console.log(`Mobile count :  ${mobileCount}`);
            break;

          case MOBILE_TOTAL_KEY:
            mobileTotal = request.data.data;
            console.log(`Mobile total :  ${mobileTotal}`);
            break;

          case DESKTOP_COUNT_KEY:
            desktopCount = request.data.data;
            console.log(`Desktop count :  ${desktopCount}`);
            break;

          case DESKTOP_TOTAL_KEY:
            desktopTotal = request.data.data;
            console.log(`Desktop total :  ${desktopTotal}`);
            break;

          default:
            console.log(request);
            break;
        }

      case GET_DEVICE_TYPE_FROM_STORAGE:
        deviceType = request.data;
        console.log(`Device Type :  ${deviceType}`);
        break;
    }
  }
});

async function sendMessage(
  tabId: number,
  action: string,
  key?: string,
  count?: number
) {
  await chrome.runtime.sendMessage({
    message: "action",
    tabid: tabId,
    action: action,
    key: key,
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
  const tab = await self.chrome.tabs.getCurrent();
  const tabId = tab?.id;
  if (tabId) {
    if (searchMode != AUTO) {
      return searchMode;
    }
    const deviceTypes: string[] = [MOBILE, DESKTOP];
    let randomDevice: string =
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    console.log(`Random Device : ${randomDevice}`);

    if (randomDevice == MOBILE) {
      if (mobileCount == mobileTotal) {
        randomDevice = DESKTOP;
      }
    }
    if (randomDevice == DESKTOP) {
      if (desktopCount == desktopTotal) {
        randomDevice = MOBILE;
      }
    }
    if (randomDevice) {
      if (randomDevice == MOBILE) {
        await sendMessage(tabId, SET_USER_AGENT, userAgent);
      } else {
        await sendMessage(tabId, SET_USER_AGENT, DESKTOP_USER_AGENT);
      }
    }
  }
}

// Function to type out each character with a delay
async function typeSearchTerm(
  searchTerm: string,
  searchBox: HTMLInputElement,
  seachFunction: Function
) {
  const tab = await self.chrome.tabs.getCurrent();
  const tabId = tab?.id;
  searchBox.value = ""; // Clear the search box before typing
  let i = 0;
  const typingDelay = 1000; // Delay in milliseconds between keystrokes
  const interval = setInterval(async () => {
    if (tabId) {
      if (i < searchTerm.length) {
        searchBox.value += searchTerm.charAt(i);
        i++;
      } else {
        if (deviceType == DESKTOP) {
          await sendMessage(
            tabId,
            SET_COUNT_DATA,
            DESKTOP_COUNT_KEY,
            desktopCount++
          );
        } else {
          await sendMessage(
            tabId,
            SET_COUNT_DATA,
            MOBILE_COUNT_KEY,
            mobileCount++
          );
        }
        await getRandomDeviceType();
        seachFunction();
        clearInterval(interval);
      }
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
    if (mobileCount != mobileTotal && desktopCount != desktopTotal) {
      await performSearch();
    }
  }, Math.floor(Math.random() * (16000 - 10000 + 1)) + 10000);
}

async function init() {
  const tab = await self.chrome.tabs.getCurrent();
  const tabId = tab?.id;
  if (tabId) {
    await sendMessage(tabId, GET_DEVICE_TYPE_FROM_STORAGE);
    await sendMessage(
      tabId,
      GET_COUNT_DATA_FROM_LOCAL_STORAGE,
      MOBILE_TOTAL_KEY
    );
    await sendMessage(
      tabId,
      GET_COUNT_DATA_FROM_LOCAL_STORAGE,
      DESKTOP_TOTAL_KEY
    );
    await sendMessage(tabId, GET_SEARCH_TYPE_FROM_STORAGE);
    await sendMessage(
      tabId,
      GET_COUNT_DATA_FROM_LOCAL_STORAGE,
      MOBILE_COUNT_KEY
    );
    await sendMessage(
      tabId,
      GET_COUNT_DATA_FROM_LOCAL_STORAGE,
      DESKTOP_COUNT_KEY
    );
    await sendMessage(tabId, GET_USER_AGENT_FROM_STORAGE);
    if (mobileCount && mobileTotal && desktopCount && desktopTotal) {
      console.log("Starting Search : Success");
      await startSearch();
    } else {
      console.log("Starting Search : Failed");
      setTimeout(async () => {
        await startSearch();
      }, 5000);
    }
  }
}

// starting extension
init();
