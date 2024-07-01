const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "X-cg-demo-api-key": "CG-u57Kgo4bChrvtbnkptmHHxfa",
  },
};

let coins = [];
const paginationContainer = document.getElementById("pagination");
const shimmerContainer =
  document.getElementsByClassName("shimmer-container")[0];
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const searchBox = document.getElementById("search-box");
const homeBtn = document.getElementById("home");
const favouritesBtn = document.getElementById("favourites");
let currentPage = 1;
let coinsPerPge = 15;

const baseUrl =
  window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");

favouritesBtn.addEventListener("click", () => {
  window.location.href = `${baseUrl}favourite.html`;
});

homeBtn.addEventListener("click", () => {
  window.location.href = `${baseUrl}index.html`;
});

const displayCoins = (coins, currentPage) => {
  const start = (currentPage - 1) * coinsPerPge + 1;
  const favourites = fetchFavouriteCoins();

  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";

  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavourite = favourites.includes(coin.id);
    row.innerHTML = `
      <td>${start + index}</td>
      <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
      <td>${coin.name}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td id="favourites"><i class="fa-solid fa-star favourite-icon ${
        isFavourite ? "favourite" : ""
      } " data-id="${coin.id}" ></i></td>
    `;
    // row.addEventListener("click", () => {
    //   window.open(`/coin.html?id=${coin.id}`, "_blank");
    // });

    row.addEventListener("click", () => {
      window.location.href = `${baseUrl}coin.html?id=${coin.id}`;
    });

    row.querySelector(".favourite-icon").addEventListener("click", (event) => {
      event.stopPropagation();
      handleFavClick(coin.id);
    });
    tableBody.appendChild(row);
  });
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

const saveFavouriteCoins = (favourites) => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const sortCoinsByPrice = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.current_price - b.current_price);
  } else if (order === "desc") {
    coins.sort((a, b) => b.current_price - a.current_price);
  }
  currentPage = 1;
  renderPagination(coins);
};

sortPriceAsc.addEventListener("click", () => {
  sortCoinsByPrice("asc");
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
});

sortPriceDesc.addEventListener("click", () => {
  sortCoinsByPrice("desc");
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
});

// search
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

const handleFavClick = (coinId) => {
  // let coinId = element.dataset.id;
  let favourites = fetchFavouriteCoins();
  // console.log(element.dataset.id);
  if (favourites.includes(coinId)) {
    favourites = favourites.filter((id) => id !== coinId);
  } else {
    favourites.push(coinId);
  }

  saveFavouriteCoins(favourites);
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

const fetchFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

const fetchCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching coins", error);
  }
};

const renderPagination = (coins) => {
  const totalPages = Math.ceil(coins.length / coinsPerPge);
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("page-Btn");

    if (currentPage === i) {
      pageBtn.classList.add("active");
    }

    pageBtn.textContent = i;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
      updatePagination();
    });
    paginationContainer.appendChild(pageBtn);
  }
  // console.log(totalPages);
};

const updatePagination = () => {
  const pageBtns = document.querySelectorAll(".page-Btn");
  console.log(pageBtns);
  pageBtns.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimer();
    coins = await fetchCoins();
    // console.log(coins);
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
    hideShimer();
  } catch (error) {
    console.error("error : ", error);
    hideShimer;
  }
});


