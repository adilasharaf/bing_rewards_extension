import { SEARCH_TYPE_LIST } from "../constants/array.constants";
import { consoleRequest, getRandomWord } from "../constants/function.constants";
import {
  AUTO,
  DESKTOP,
  GET_DATA_FROM_STORAGE,
  GET_DESKTOP_COUNT,
  GET_MOBILE_COUNT,
  MOBILE,
  REDIRECT,
  RELOAD,
  SET_SUCCESS,
  SUBMIT,
  SUGGESTION,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";
import { RequestInterface } from "../interface/request.interface";

let contentData: DataInterface;
let mobileCount: number;
let desktopCount: number;
let isRunning: boolean = false;

// functions
chrome.runtime.onMessage.addListener((request: RequestInterface) => {
  switch (request.method) {
    case GET_DATA_FROM_STORAGE:
      contentData = request.data as DataInterface;
      return;

    case GET_MOBILE_COUNT:
      mobileCount = request.data as number;
      console.log(`Mobile count :  ${mobileCount}`);
      return;

    case GET_DESKTOP_COUNT:
      desktopCount = request.data as number;
      console.log(`Desktop count :  ${desktopCount}`);
      return;

    default:
      consoleRequest(request);
  }
});

async function sendMessage(
  method: string,
  data?: DataInterface | string | number | any,
  key?: string
) {
  await chrome.runtime.sendMessage({
    method: method,
    data: data,
    key: key,
  });
}

// Function to type out each character with a delay
async function typeSearchTerm(searchBox: any, seachFunction: Function) {
  // get search term
  const searchTerm = getRandomWord();
  console.log(`Random generated word : ${searchTerm}`);
  if (!searchBox) {
    return await sendMessage(RELOAD);
  }
  await sendMessage(SET_SUCCESS, {
    contentData: contentData,
    mobileCount: mobileCount,
    desktopCount: desktopCount,
  });
  searchBox.focus();
  searchBox.click();
  searchBox.value = ""; // Clear the search box before typing
  let i = 0;
  const typingDelay = 1000; // Delay in milliseconds between keystrokes
  const interval: any = setInterval(async () => {
    if (i < searchTerm.length) {
      searchBox.value += searchTerm.charAt(i);
      i++;
    } else {
      const type =
        SEARCH_TYPE_LIST[Math.floor(Math.random() * SEARCH_TYPE_LIST.length)];
      console.log(`Search Type : ${type}`);
      switch (type) {
        case SUGGESTION:
          return await suggestionSearch(seachFunction, interval);

        case SUBMIT:
          clearInterval(interval);
          return await seachFunction();

        default:
          return await suggestionSearch(seachFunction, interval);
      }
    }
  }, typingDelay);
}

async function suggestionSearch(seachFunction: Function, interval: any) {
  const suggestionDiv = document.querySelector("div[id='sw_as']");
  const suggestionList = suggestionDiv?.querySelector(
    "ul[aria-label='Suggestions']"
  );
  if (!suggestionDiv || !suggestionList) {
    console.log("suggestion div not found.");
    clearInterval(interval);
    return await seachFunction();
  }

  const listItems = suggestionList.querySelectorAll("li[role='option']");
  if (listItems.length > 0) {
    const randomListItem = listItems[
      Math.floor(Math.random() * listItems.length)
    ] as HTMLLIElement;

    console.log(randomListItem);
    const url = randomListItem.getAttribute("url");
    console.log(url);
    clearInterval(interval);
    await sendMessage(REDIRECT, url);
  } else {
    console.log("No list items found within the suggestion box");
    clearInterval(interval);
    await seachFunction();
  }
}

// Function to perform the search with typing effect
async function performSearch() {
  const searchForm = document.querySelector("form");

  const searchBox =
    searchForm?.querySelector("textarea[name='q']") ??
    searchForm?.querySelector("input[name='q']");
  const searchButton: any = searchForm?.querySelector("input[name='go']");
  const searchIcon: any = searchForm?.querySelector("label[id='search_icon']");
  // focus and click search form
  searchForm?.focus();
  searchForm?.click();

  return await typeSearchTerm(searchBox, async () => {
    if (searchIcon) {
      console.log(" Search Icon Submit");
      searchIcon?.click();
    } else if (searchButton) {
      console.log("Search Button Submit");
      searchButton?.click();
    } else {
      console.log("Search Form Submit");
      searchForm?.submit();
    }
  });
}

async function init() {
  await sendMessage(GET_DATA_FROM_STORAGE);
  await sendMessage(GET_MOBILE_COUNT);
  await sendMessage(GET_DESKTOP_COUNT);

  setTimeout(async () => {
    if (!mobileCount && !desktopCount && !contentData) {
      console.log("Starting Search : Failed");
      return await init();
    } else {
      if (isRunning) {
        return;
      }
      isRunning = true;
      console.log("Starting Search : Success");
      setTimeout(async () => {
        console.log({
          desktopCount: desktopCount,
          desktopTotal: contentData.desktopTotal,
          mobileCount: mobileCount,
          mobileTotal: contentData.mobileTotal,
        });

        switch (contentData.searchMode) {
          case AUTO:
            if (
              mobileCount >= contentData.mobileTotal &&
              desktopCount >= contentData.desktopTotal
            ) {
              console.log("Completed  Auto Search");
              window.alert("Auto Searches completed successfully");
              return;
            }
            return await performSearch();

          case MOBILE:
            if (mobileCount >= contentData.mobileTotal) {
              console.log("Completed  Mobile Search");
              window.alert("Mobile Searches completed successfully");
              return;
            }
            return await performSearch();

          case DESKTOP:
            if (desktopCount >= contentData.desktopTotal) {
              console.log("Completed  Desktop Search");
              window.alert("Desktop Searches completed successfully");
              return;
            }
            return await performSearch();

          default:
            console.log(contentData.searchMode);
            return await performSearch();
        }
      }, Math.floor(Math.random() * 5000) + contentData.time * 1000);
    }
  }, 5000);
}

// starting extension
init();
