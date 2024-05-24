const mobileSelect: HTMLSelectElement = document.getElementById(
  "mobile"
) as HTMLSelectElement;

const desktopSelect: HTMLSelectElement = document.getElementById(
  "desktop"
) as HTMLSelectElement;

const mobileKey: string = "mobile-count";
const dekstopKey: string = "desktop-count";

function setCountData(key: string, count: number): void {
  localStorage.setItem(key, count.toString());
}

function getCountDataFromLocalStorage(key: string): number {
  const data = localStorage.getItem(key);
  if (data) {
    return Number.parseInt(data);
  }
  if (key == mobileKey) {
    setCountData(key, 25);
  } else {
    setCountData(key, 35);
  }
  return getCountDataFromLocalStorage(key);
}

function populateSelect() {
  if (mobileSelect) {
    for (let i = 0; i < 100; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = i.toString();
      option.text = i.toString();
      mobileSelect.appendChild(option);
    }
    mobileSelect.value = getCountDataFromLocalStorage(mobileKey).toString();
  }

  if (desktopSelect) {
    for (let i = 0; i < 100; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = i.toString();
      option.text = i.toString();
      desktopSelect.appendChild(option);
    }
    desktopSelect.value = getCountDataFromLocalStorage(dekstopKey).toString();
  }
}

function handleClick() {
  const selectedMobile = mobileSelect.value;
  console.log(`Selected Mobile: ${selectedMobile}`);

  const selectedDesktop = desktopSelect.value;
  console.log(`Selected Desktop: ${selectedDesktop}`);

  setCountData(mobileKey, Number.parseInt(selectedMobile));
  setCountData(dekstopKey, Number.parseInt(selectedDesktop));
}

populateSelect();
