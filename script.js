"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function displayMovements(movements) {
  containerMovements.innerHTML = "";
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>
    `;
    //console.log(html);
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function showBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //console.log(balance);
  labelBalance.textContent = `${acc.balance} €`;
}

function calcDepositsinUSD(movements) {
  const depositsUSD = movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * 1.1)
    .reduce((acc, mov) => acc + mov, 0);
  return depositsUSD;
}
//calcDepositsinUSD(account1.movements);

function displaySummary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //console.log(out);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interestSum = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      //console.log(arr);
      return interest >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interestSum}€`;
}

function createUserNames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    //console.log(acc);
  });
}
createUserNames(accounts);

function updateUI() {
  displayMovements(currentAccount.movements);
  showBalance(currentAccount);
  displaySummary(currentAccount);
}

//login
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
  }

  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur(); //lose focus

  updateUI();
});

//transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, reciver);

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    reciver &&
    reciver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciver.movements.push(amount);

    updateUI();
  }

  inputTransferAmount.value = inputTransferTo.value = "";
});

//loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amountLoan = Number(inputLoanAmount.value);

  if (
    amountLoan > 0 &&
    currentAccount.movements.some((mov) => mov >= amountLoan * 0.1)
  ) {
    currentAccount.movements.push(amountLoan);
    updateUI();
  }
  inputLoanAmount.value = "";
});

//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    // delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
