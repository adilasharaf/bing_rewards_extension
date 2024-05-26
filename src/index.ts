import {
  getCountDataFromLocalStorage,
  getSearchTypeFromStorage,
  getUserAgentFromStorage,
  setCountData,
} from "./common";
import { SEARCH_MODES } from "./constants/array.constants";
import {
  DESKTOP,
  DESKTOP_TOTAL_KEY,
  MOBILE,
  MOBILE_TOTAL_KEY,
  MOBILE_USER_AGENT_KEY,
  SEARCH_MODE_KEY,
} from "./constants/string.constants";

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

async function populateItems() {
  if (mobileSelect) {
    for (let i = 0; i < 100; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = i.toString();
      option.text = i.toString();
      mobileSelect.appendChild(option);
    }

    mobileSelect.value =
      getCountDataFromLocalStorage(MOBILE_TOTAL_KEY).toString();
  }

  if (desktopSelect) {
    for (let i = 0; i < 100; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = i.toString();
      option.text = i.toString();
      desktopSelect.appendChild(option);
    }
    desktopSelect.value =
      getCountDataFromLocalStorage(DESKTOP_TOTAL_KEY).toString();
  }

  if (modeSelect) {
    for (let i = 0; i < SEARCH_MODES.length; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = SEARCH_MODES[i];
      option.text = SEARCH_MODES[i];
      modeSelect.appendChild(option);
    }
    modeSelect.value = await getSearchTypeFromStorage();
  }

  if (userAgentInput) {
    userAgentInput.value = await getUserAgentFromStorage();
  }
}

function handleClick() {
  const selectedMobile = mobileSelect.value;
  console.log(`Selected Mobile: ${selectedMobile}`);

  const selectedDesktop = desktopSelect.value;
  console.log(`Selected Desktop: ${selectedDesktop}`);

  const selectedMode = modeSelect.value;
  console.log(`Selected Search Mode: ${selectedMode}`);

  const userAgent = userAgentInput.value;
  console.log(`User Agent: ${userAgent}`);

  setCountData(MOBILE_TOTAL_KEY, Number.parseInt(selectedMobile));
  setCountData(DESKTOP_TOTAL_KEY, Number.parseInt(selectedDesktop));
  localStorage.setItem(SEARCH_MODE_KEY, selectedMode);
  localStorage.setItem(MOBILE_USER_AGENT_KEY, userAgent);
}

sumbitButton.addEventListener("click", handleClick);
populateItems();
