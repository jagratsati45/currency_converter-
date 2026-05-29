const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// DOM Elements
const dropdowns = document.querySelectorAll(".currency-picker select");
const btn = document.querySelector("#convert-btn");
const form = document.querySelector("#converter-form");
const fromCurr = document.querySelector("#from-select");
const toCurr = document.querySelector("#to-select");
const msg = document.querySelector("#result-text");
const swapBtn = document.querySelector("#swap-btn");
const amountInput = document.querySelector("#amount-input");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Exchange rate update
const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  // Show loading state
  btn.classList.add("loading");
  msg.style.opacity = "0.5";

  try {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    const response = await fetch(URL);
    const data = await response.json();
    const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    const finalAmount = (amtVal * rate).toFixed(2);

    // Animate result
    msg.style.transition = "opacity 0.3s ease";
    msg.style.opacity = "0";

    setTimeout(() => {
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
      msg.style.opacity = "1";
    }, 300);
  } catch (error) {
    msg.innerText = "Unable to fetch rate. Try again.";
    msg.style.opacity = "1";
  } finally {
    btn.classList.remove("loading");
  }
};

// Update flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Swap currencies
swapBtn.addEventListener("click", () => {
  const tempVal = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempVal;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Form submit
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load initial rate
window.addEventListener("load", () => {
  updateExchangeRate();
});

// Live conversion on input change (debounced)
let debounceTimer;
amountInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (amountInput.value && amountInput.value > 0) {
      updateExchangeRate();
    }
  }, 500);
});
