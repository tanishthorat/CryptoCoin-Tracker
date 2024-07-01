const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDescription = document.getElementById("coin-description");
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const coinContainer = document.getElementById("coin-container");
const ctx = document.getElementById("coinChart");
const buttonContainer = document.querySelectorAll(".button-container");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "X-cg-demo-api-key": "CG-u57Kgo4bChrvtbnkptmHHxfa",
  },
};

let coinsData = [];
const paginationContainer = document.getElementById("pagination");
const shimmerContainer =
  document.getElementsByClassName("shimmer-container")[0];
const searchBox = document.getElementById("search-box");
const homeBtn = document.getElementById("home");
const favouritesBtn = document.getElementById("favourites");
let currentPage = 1;
let coinsPerPge = 15;

favouritesBtn.addEventListener("click", () => {
  window.location.href = `favourite.html`;
});

homeBtn.addEventListener("click", () => {
  window.location.href = `index.html`;
});

const displayCoinsData = (coinData) => {
  coinImage.src = coinData.image.large;
  coinName.textContent = coinData.name;
  coinDescription.textContent = coinData.description.en.split(".")[0];
  coinRank.textContent = coinData.market_cap_rank;
  coinPrice.textContent = `$${coinData.market_data.current_price.usd}`;
  coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;

  coinContainer.style.display = "block";
};
const showShimer = () => {
  shimmerContainer.style.display = "flex";
};

const hideShimer = () => {
  shimmerContainer.style.display = "none";
};

const getCoinsToDisplay = (coins, page) => {
  const start = (page - 1) * coinsPerPge;
  const end = start + coinsPerPge;
  return coins.slice(start, end);
};

// sortPriceAsc.addEventListener("click", () => {
//   sortCoinsByPrice("asc");
//   displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
// });

// sortPriceDesc.addEventListener("click", () => {
//   sortCoinsByPrice("desc");
//   displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
// });

const handleSearch = () => {
  const searchquery = searchBox.value.trim();
  const searchedCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchquery.toLowerCase())
  );
  currentPage = 1;
  displayCoins(getCoinsToDisplay(searchedCoins, currentPage), currentPage);
  renderPagination(searchedCoins);
};

searchBox.addEventListener("input", () => {
  handleSearch();
});

const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get("id");

const fetchCoinData = async () => {
  try {
    showShimer();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );
    const coinData = await response.json();
    console.log(coinData);
    displayCoinsData(coinData);
    hideShimer();
  } catch (error) {
    hideShimer();
    console.log("Error while fetching coin data", error);
  }
};

const coinChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Price (USD)",
        data: [],
        borderWidth: 1,
        borderColor: "#eebc1d",
        fill:false
      },
    ],
  },
});

// Fetch the chart data from API

const fetchChartData = async (days) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      options
    );
    const chartData = await response.json();
    updateChart(chartData.prices);
  } catch (error) {
    console.error("Error while fetching chart data", error);
  }
};

const updateChart = (prices) => {
    const data = prices.map((price) => price[1]);
    const labels = prices.map((price) => {
      let date = new Date(price[0]);
      return date.toLocaleDateString();
    });

    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update()

};

//on button click
buttonContainer.forEach((button) => {
  button.addEventListener("click", () => {
    const days =
      event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
    fetchChartData(days);
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCoinData();

  document.getElementById("24h").click();
});
