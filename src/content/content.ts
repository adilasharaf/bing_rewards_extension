"use strict";
import {
  DeviceTypes,
  getDeviceTypeFromStorage,
  getUserAgentFromStorage,
} from "../common/common";
import { WORDS } from "../constants/array.constants";
import {
  DESKTOP,
  DESKTOP_COUNT_KEY,
  DESKTOP_TOTAL_KEY,
  GET_WORDS_URL,
  MOBILE,
  MOBILE_COUNT_KEY,
  MOBILE_TOTAL_KEY,
  SEARCH_MODE_KEY,
} from "../constants/string.constants";

const searchMode: DeviceTypes = getDeviceTypeFromStorage();

const headerRules = {
  addRules: [
    {
      id: 36,
      priority: 2,
      action: {
        type: "modifyHeaders" as chrome.declarativeNetRequest.RuleActionType,
        requestHeaders: [
          {
            header: "user-agent",
            operation: "set" as chrome.declarativeNetRequest.HeaderOperation,
            value: getUserAgentFromStorage(),
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

// mobile
let mobileCount: number = getCountDataFromLocalStorage(MOBILE_COUNT_KEY);
const mobileTotal: number = getCountDataFromLocalStorage(MOBILE_TOTAL_KEY);

// desktop
let desktopCount: number = getCountDataFromLocalStorage(DESKTOP_COUNT_KEY);
const desktopTotal: number = getCountDataFromLocalStorage(DESKTOP_TOTAL_KEY);

// functions

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

function getRandomDeviceType() {
  if (searchMode != DeviceTypes.auto) {
  }
}

// Function to type out each character with a delay
async function typeSearchTerm(
  searchTerm: string,
  searchBox: HTMLInputElement,
  seachFunction: Function
) {
  searchBox.value = ""; // Clear the search box before typing
  let i = 0;
  const typingDelay = 1000; // Delay in milliseconds between keystrokes
  const interval = setInterval(() => {
    if (i < searchTerm.length) {
      searchBox.value += searchTerm.charAt(i);
      i++;
    } else {
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
    await typeSearchTerm(searchTerm, searchBox, () => {
      searchButton.click();
    });
  } else {
    console.log("No Search Button");
    const searchIcon: HTMLLabelElement = document.getElementById(
      "search_icon"
    ) as HTMLLabelElement;

    if (searchIcon) {
      await typeSearchTerm(searchTerm, searchBox, () => {
        searchIcon.click();
      });
    } else {
      console.log("No Search Icon");
      await typeSearchTerm(searchTerm, searchBox, () => {
        searchForm.submit();
      });
    }
  }

  // setCountData(currentCount++);
}

async function startExtension() {
  if (searchMode == DeviceTypes.mobile) {
    try {
      chrome.declarativeNetRequest.updateDynamicRules(headerRules, async () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          chrome.declarativeNetRequest.getDynamicRules((rules) =>
            console.log(rules)
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Start the search with a random delay
  setTimeout(async () => {
    // console.log(currentCount);
    // console.log(currentCount);
    await performSearch();
  }, Math.floor(Math.random() * (16000 - 10000 + 1)) + 10000);
}

startExtension();
