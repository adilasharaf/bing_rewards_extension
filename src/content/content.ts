"use strict";
import { WORDS } from "../constants/array.constants";
import { consoleRequest } from "../constants/function.constants";
import {
  AUTO,
  CONSTANT,
  DESKTOP,
  GET_DATA_FROM_STORAGE,
  GET_DESKTOP_COUNT,
  GET_MOBILE_COUNT,
  GET_WORDS_URL,
  MOBILE,
  PACAKGE,
  SET_SUCCESS,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";
import { RequestInterface } from "../interface/request.interface";
import { generate } from "../packages/random-word.package";

let contentData: DataInterface;
let mobileCount: number;
let desktopCount: number;
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

// Function to get a random word from the list
async function getRandomWord(): Promise<string> {
  const list = [PACAKGE, CONSTANT];
  const random = list[Math.random() * list.length];
  switch (random) {
    case PACAKGE:
      return generate({ minLength: 9, maxLength: 15}) as string;
    case CONSTANT:
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    default:
      console.log(random);
      return generate({ minLength: 9, maxLength: 15 }) as string;
  }
}

// Function to type out each character with a delay
async function typeSearchTerm(
  searchTerm: string,
  searchBox: HTMLInputElement,
  seachFunction: Function
) {
  await sendMessage(SET_SUCCESS, {
    contentData: contentData,
    mobileCount: mobileCount,
    desktopCount: desktopCount,
  });
  searchBox.value = ""; // Clear the search box before typing
  let i = 0;
  const typingDelay = 1000; // Delay in milliseconds between keystrokes
  const interval = setInterval(async () => {
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

async function init() {
  await sendMessage(GET_DATA_FROM_STORAGE);
  await sendMessage(GET_MOBILE_COUNT);
  await sendMessage(GET_DESKTOP_COUNT);

  if (!mobileCount && !desktopCount && !contentData) {
    console.log("Starting Search : Failed");
    setTimeout(async () => {
      return await init();
    }, 5000);
  }

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
        await performSearch();
        return;

      case MOBILE:
        if (mobileCount >= contentData.mobileTotal) {
          console.log("Completed  Mobile Search");
          window.alert("Mobile Searches completed successfully");
          return;
        }
        await performSearch();
        return;

      case DESKTOP:
        if (desktopCount >= contentData.desktopTotal) {
          console.log("Completed  Desktop Search");
          window.alert("Desktop Searches completed successfully");
          return;
        }
        await performSearch();
        return;

      default:
        console.log(contentData.searchMode);
        return;
    }
  }, Math.floor(Math.random() * (16000 - contentData.time * 1000 + 1)) + contentData.time * 1000);
}

// starting extension
init();
