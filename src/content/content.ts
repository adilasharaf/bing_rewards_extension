"use strict";
import { WORDS } from "../constants/array.constants";
import { consoleRequest } from "../constants/function.constants";
import {
  GET_DATA_FROM_STORAGE,
  GET_DESKTOP_COUNT,
  GET_MOBILE_COUNT,
  GET_WORDS_URL,
  SET_SUCCESS,
} from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";
import { RequestInterface } from "../interface/request.interface";

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
  try {
    const response = await fetch(GET_WORDS_URL + 1);
    const data = await response.json();
    console.log(data);
    return data[0];
  } catch (error) {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
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

  if (mobileCount && desktopCount && contentData) {
    console.log("Starting Search : Success");

    setTimeout(async () => {
      console.log({
        desktopCount: desktopCount,
        desktopTotal: contentData.desktopTotal,
        mobileCount: mobileCount,
        mobileTotal: contentData.mobileTotal,
      });

      console.log(
        `Count-Total check : ${
          mobileCount <= contentData.mobileTotal ||
          desktopCount <= contentData.desktopTotal
        }`
      );
      if (
        mobileCount <= contentData.mobileTotal ||
        desktopCount <= contentData.desktopTotal
      ) {
        await performSearch();
      } else {
        console.log("Completed Search");
        window.alert("Auto Searches completed successfully");
      }
    }, Math.floor(Math.random() * (16000 - contentData.time * 1000 + 1)) + contentData.time * 1000);
  } else {
    console.log("Starting Search : Failed");
    setTimeout(async () => {
      await init();
    }, 5000);
  }
}

// starting extension
init();
