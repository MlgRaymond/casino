// Function to retrieve a cookie by name
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); // Trim whitespace around cookie string
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null; // Return null if cookie not found
}

// Function to set a cookie with a given name and value
function setCookie(cname, cvalue) {
    document.cookie = `${cname}=${cvalue};path=/`;
}

// Function to update UI elements with current balance and debt
function updateUI() {
    let balance = getCookie("balance") || 0;
    let owe = getCookie("owe") || 0;
    
    document.getElementById("balance").innerText = `Balance $${balance}`;
    document.getElementById("owe").innerText = `YOU OWE THE BANK $${owe}`;
}

// Event listener for the cash out button
document.getElementById("cash").addEventListener("click", () => {
    let amount = Number(document.getElementById("amount").value);
    if (amount < 1 || amount > 100 || isNaN(amount)) {
        document.getElementById("message").innerText = "Enter a valid number between 1-100";
        return;
    }

    let balance = Number(getCookie("balance")) || 0;
    let owe = Number(getCookie("owe")) || 0;

    let newBalance = balance + amount;
    let newOwe = owe + amount;

    setCookie("balance", newBalance);
    setCookie("owe", newOwe);

    updateUI();
    document.getElementById("message").innerText = `Success! Your balance is now $${newBalance}`;
});

// Event listener for the pay debts button
document.getElementById("pay").addEventListener("click", () => {
    let amount = Number(document.getElementById("amount").value);
    let balance = Number(getCookie("balance")) || 0;
    let owe = Number(getCookie("owe")) || 0;

    if (amount > balance || isNaN(amount) || amount <= 0) {
        document.getElementById("message").innerText = "You don't have enough money!";
        return;
    }

    let newBalance = balance - amount;
    let newOwe = owe - amount;

    if (newOwe < 0) {
        document.getElementById("message").innerText = "Too much money!";
        return;
    }

    setCookie("balance", newBalance);
    setCookie("owe", newOwe);

    updateUI();
    document.getElementById("message").innerText = `Success! Your balance is now $${newBalance}`;
});

document.getElementById("back").addEventListener("click", () => {
	window.location.href = "../../../"
});

// Initial update of UI when the page loads
updateUI();
