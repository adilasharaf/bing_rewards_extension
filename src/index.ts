import { getDatafromStorage, setData } from "./common";
import { SEARCH_MODES } from "./constants/array.constants";
import { DESKTOP, MOBILE, SET_DATA } from "./constants/string.constants";

const mobileSelect: HTMLSelectElement = document.getElementById(
  MOBILE
) as HTMLSelectElement;

const desktopSelect: HTMLSelectElement = document.getElementById(
  DESKTOP
) as HTMLSelectElement;

const modeSelect: HTMLSelectElement = document.getElementById(
  "mode"
) as HTMLSelectElement;

const userAgentInput: HTMLInputElement = document.getElementById(
  "user-agent"
) as HTMLInputElement;

const sumbitButton: HTMLButtonElement = document.getElementById(
  "submit-button"
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
        const option: HTMLOptionElement = document.createElement("option");
        option.value = i.toString();
        option.text = i.toString();
        mobileSelect.appendChild(option);
      }

      mobileSelect.value = contentData.mobileTotal.toString();
    }

    if (desktopSelect) {
      for (let i = 0; i < 100; i++) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = i.toString();
        option.text = i.toString();
        desktopSelect.appendChild(option);
      }
      desktopSelect.value = contentData.desktopTotal.toString();
    }

    if (modeSelect) {
      for (let i = 0; i < SEARCH_MODES.length; i++) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = SEARCH_MODES[i];
        option.text = SEARCH_MODES[i];
        modeSelect.appendChild(option);
      }
      modeSelect.value = contentData.searchMode;
    }

    if (userAgentInput) {
      userAgentInput.value = contentData.userAgent;
    }
  }
}

async function handleClick() {
  await chrome.runtime.sendMessage({
    action: SET_DATA,
    data: {
      ...contentData,
      mobileTotal: Number.parseInt(mobileSelect.value),
      userAgent: userAgentInput.value,
      desktopTotal: Number.parseInt(desktopSelect.value),
      searchMode: modeSelect.value,
    },
  });
}

sumbitButton.addEventListener("click", handleClick);
populateItems();
