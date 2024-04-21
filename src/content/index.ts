let isSearching: boolean = false;
let count: number = 0;
let time: number = 0;
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.isSearching) {
  } else {
  }
});

async function getWords(): Promise<string[]> {
  const url = "https://random-word-api.herokuapp.com/word?number=";
  try {
    const response = await fetch(`${url}${count}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data = await response.json();
    // Type assertion might be necessary based on actual API response format
    return data as string[];
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error gracefully in your component (e.g., display an error message)
    return []; // Return an empty array in case of error
  }
}
async function startSearch() {}
