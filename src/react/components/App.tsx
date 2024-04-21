let isSearching: boolean = false;
let count: number = 35;
let time: number = 10;
const countList: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
const timeList: number[] = Array.from({ length: 500 }, (_, i) => i + 1);

async function sendeMessage() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  await chrome.tabs.sendMessage(activeTab.id || 0, {
    isSearching,
    count,
    time,
  });
}

async function handleClick() {
  isSearching = !isSearching;
  await sendeMessage();
}

async function handleCountChange(value: number) {
  count = value;
  await sendeMessage();
}

async function handleTimeChange(value: number) {
  time = value;
  await sendeMessage();
}

const App = () => {
  return (
    <main className="block">
      <h2>Automate Bing Search</h2>
      <div className="flex">
        <p>Change Count : </p>
        <div>
          <select
            value={count}
            onChange={(event) =>
              handleCountChange(parseInt(event.target.value, 35))
            }
          >
            {countList.map((v: number) => (
              <option value={v}>{v.toString()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex">
        <p>Change Time : </p>
        <div>
          <select
            value={time}
            onChange={(event) =>
              handleTimeChange(parseInt(event.target.value, 10))
            }
          >
            {timeList.map((v: number) => (
              <option value={v}>{v.toString()}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="text-white bg-black"
      >
        {isSearching ? "Start" : "Stop"}
      </button>
    </main>
  );
};

export default App;
