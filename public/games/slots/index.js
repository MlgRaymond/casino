document.addEventListener("DOMContentLoaded", function() {
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }

  let cost = 10;
  let multiplier = 1;
  let currentReward = 100;
  const iconMap = {0: "chip", 1: "dude", 2: "oz", 3: "asian", 4: "skull", 5: "apple", 6: "slots", 7: "rizz", 8: "towerdefense"};
  const icon_width = 79;
  const icon_height = 79;
  const num_icons = 9;
  const time_per_icon = 100;
  let indexes = [0, 0, 0];
  let rewards = [];
  const probabilities = [
    { icon: 0, probability: 5 },    // chip
    { icon: 1, probability: 3 },    // dude
    { icon: 2, probability: 1 },    // oz
    { icon: 3, probability: 0.7 },  // asian
    { icon: 4, probability: 0.3 },  // skull
    { icon: 5, probability: 0.1 },  // apple
    { icon: 6, probability: 0.05 }, // slots
    { icon: 7, probability: 0.01 }, // rizz
    { icon: 8, probability: 0.001 } // towerdefense
  ];
  const table = document.getElementById("rewards");

  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];

    let newCell = row.insertCell(-1);
    newCell.innerText = `$${currentReward}`;
    newCell.classList.add("reward-amount");

    newCell = row.insertCell(-1);
    newCell.innerText = `${multiplier}x`;
    newCell.classList.add("multiply");

    newCell = row.insertCell(-1);
    newCell.classList.add("reward");
    newCell.dataset.reward = currentReward;
    newCell.innerText = `$${currentReward}`;

    rewards.push({
      amount: currentReward
    });

    newCell = row.insertCell(-1);
    newCell.classList.add("probability");
    newCell.innerText = probabilities[i - 1]["probability"] + "%";
    currentReward *= 2;
  }

  const value = document.querySelector("#mult");
  const input = document.querySelector("#multiplier");

  value.textContent = `Multiplier: ${multiplier}`;
  input.addEventListener("input", (event) => {
    let balance = parseFloat(getCookie("balance"));
    multiplier = parseInt(event.target.value);
    cost = 10 * multiplier;

    if (cost > balance) {
      input.value = 0;
      return;
    }
    document.querySelectorAll('.multiply').forEach((element) => {
      element.innerText = `${multiplier}x`;
      document.getElementById("mult").innerText = "Multiplier: " + multiplier;
    });

    document.querySelectorAll(".reward").forEach((reward) => {
      let rewardAmount = parseInt(reward.dataset.reward);
      reward.innerText = `$${multiplier * rewardAmount}`;
    });

    document.getElementById("cost").innerText = `Cost per roll: ${cost}`;
  });

  const debugEl = document.getElementById('debug');

  function roll(reel, targetIndex, fullRotations, offset = 0) {
    const delta = (fullRotations * num_icons) + targetIndex;
    const targetBackgroundPositionY = delta * icon_height;
    const normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    return new Promise((resolve) => {
      // Apply blur effect when spinning
      reel.style.filter = "blur(5px)";

      setTimeout(() => {
        reel.style.transition = `background-position-y ${((fullRotations * num_icons + targetIndex) * time_per_icon)}ms cubic-bezier(.41,-0.01,.63,1.09)`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;
      }, offset * 150);

      setTimeout(() => {
        reel.style.transition = `none`;
        reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
        reel.style.filter = "none"; // Remove blur effect when stopped
        resolve(targetIndex);
      }, ((fullRotations * num_icons + targetIndex) * time_per_icon) + offset * 150);
    });
  }

  function determineOutcome() {
    const totalProbability = probabilities.reduce((sum, item) => sum + item.probability, 0);
    const randomListProbability = 100 - totalProbability;

    const weightedArray = [];
    probabilities.forEach((item) => {
      for (let i = 0; i < item.probability * 1000; i++) {
        weightedArray.push(item.icon);
      }
    });

    for (let i = 0; i < randomListProbability * 1000; i++) {
      weightedArray.push("random");
    }

    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    const selectedOutcome = weightedArray[randomIndex];

    if (selectedOutcome === "random") {
      let uniqueIcons = [];
      while (uniqueIcons.length < 3) {
        let icon = Math.floor(Math.random() * num_icons);
        if (!uniqueIcons.includes(icon)) {
          uniqueIcons.push(icon);
        }
      }
      return uniqueIcons;
    } else {
      return [selectedOutcome, selectedOutcome, selectedOutcome];
    }
  }

  function rollAll() {
    let balance = parseFloat(getCookie("balance"));

    setCookie("balance", balance - cost);
    debugEl.textContent = 'rolling...';
    document.getElementById("balance").innerText = `Balance: ${getCookie("balance")}`;

    const reelsList = document.querySelectorAll('.slots > .reel');

    const outcome = determineOutcome();
    indexes = outcome;

    Promise.all([
      roll(reelsList[0], outcome[0], 3, 0),
      roll(reelsList[1], outcome[1], 5, 1),
      roll(reelsList[2], outcome[2], 7, 2)
    ]).then(() => {
      debugEl.textContent = indexes.map((i) => iconMap[i]).join(' - ');

      if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
        let winAmount = rewards[indexes[0]].amount * multiplier;
        setCookie("balance", balance + winAmount);
        document.getElementById("balance").innerText = `Balance: ${getCookie("balance")}`;
        document.querySelector(".slots").classList.add("win2");
        setTimeout(() => document.querySelector(".slots").classList.remove("win2"), 2000);
      }

      document.getElementById("spin").removeAttribute("disabled");
      document.getElementById("multiplier").removeAttribute("disabled");
    });
  }

  document.getElementById("spin").addEventListener("click", () => {
    let balance = parseFloat(getCookie("balance"));

    if (balance >= cost) {
      rollAll();
      document.getElementById("spin").disabled = true;
      document.getElementById("multiplier").disabled = true;
      setTimeout(() => {
        document.getElementById("spin").removeAttribute("disabled");
        document.getElementById("multiplier").removeAttribute("disabled");
      }, 5000);
    }
  });

  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "/";
  });

  document.getElementById("cost").innerText = `Cost per roll: ${cost}`;
  document.getElementById("balance").innerText = `Balance: ${getCookie("balance")}`;
});
