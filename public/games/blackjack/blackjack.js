var buttonp = false
let deck;
let dHand;
let pHand;
var playing;
var stand = false;
class Card {
  constructor(value, suit) {
      this.value = value;
      this.suit = suit;
  }

  toString() {
      return `${this.suit} of ${this.value}`;
  }
}

class Deck {
  cardSuits = {
      0: "Hearts",
      1: "Clubs",
      2: "Diamonds",
      3: "Spades"
  };

  constructor() {
      this.cards = [];
      for (let i = 0; i < 4; i++) {
          for (let j = 1; j <= 13; j++) { // 1 = Ace, 11-13 = Jack, Queen, King
              this.cards.push(new Card(j, this.cardSuits[i]));
          }
      }
  }

  toString() {
      let string = "";
      for (let card of this.cards) {
          string += card.toString() + "\n";
      }
      return string;
  }

  drawCard() {
      const drawn = this.cards.pop(); // Draw from the end of the array (top of the deck)
      return drawn;
  }

  shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
  }
}

class Hand {
  constructor() {
    this.hand = [];
  }

  drawCard(deck) {
    var card = deck.drawCard();
    this.hand.push(card);
    return card;
  }

  toString() {
      let string = "";
      for (let card of this.hand) {
          string += `${card.toString()}, `;
      }
      return string.slice(0, -2);
  }

  total() {
      let amount = 0;
      let aceCount = 0; // Track number of Aces

      for (let card of this.hand) {
          if (card.value >= 10) {
              amount += 10; // Face cards have value 10
          } else if (card.value === 1) {
              aceCount++; // Ace found
              amount += 11; // Assume Ace as 11 initially
          } else {
              amount += card.value; // Number cards
          }
      }

      // Adjust Ace values from 11 to 1 if total exceeds 21
      while (amount > 21 && aceCount > 0) {
          amount -= 10; // Change Ace from 11 to 1
          aceCount--; // Decrement Ace count
      }

      return amount;
  }
}

function formatCard(value, suit) {
  let cardValue = '';

  // Convert numeric card values to face cards or ace
  if (value >= 2 && value <= 10) {
      cardValue = value.toString();
  } else if (value === 1) {
      cardValue = "ace";
  } else if (value === 11) {
      cardValue = "jack";
  } else if (value === 12) {
      cardValue = "queen";
  } else if (value === 13) {
      cardValue = "king";
  } else {
      throw new Error("Invalid card value");
  }

  // Convert suit to lowercase
  const formattedSuit = suit.toLowerCase();

  // Return formatted card string
  const img = document.createElement("img");
  img.src = `cards/${cardValue}_of_${formattedSuit}.png`; // Adjust path as needed
  img.alt = `${cardValue} of ${suit}`; // Alt text for accessibility
  return img
}
var playerHand = "player-cards";
var dealerHand = "dealer-cards";

var folder = "/cards";
function displayMessage(message) {
  document.getElementById("game-messages").innerText = message
}
function blackjack(bet) {
  console.log("Making deck...");
  deck = new Deck();
  console.log("Shuffling...\n\n");
  deck.shuffle();

  dHand = new Hand();
  pHand = new Hand();

  // Initial deal
  var card1 = pHand.drawCard(deck);
  var card2 = pHand.drawCard(deck);
  var card3 = dHand.drawCard(deck);

  displayCard(card1.value, card1.suit, playerHand);
  displayCard(card2.value, card2.suit, playerHand);
  displayCard(card3.value, card3.suit, dealerHand);
  console.log(`The dealer's hand is ${dHand.toString()} (Total: ${dHand.total()})`);
  console.log(`\nYour hand is ${pHand.toString()} (Total: ${pHand.total()})`);
  document.getElementById("dealer-cards-message").innerText = "Dealer Cards (" + dHand.total() + ")";

  // Player's turn
  var interval = setInterval(function() {
    document.getElementById("player-cards-message").innerText = "Your Cards (" + pHand.total() + ")";
    if (pHand.total() <= 21  ) {
      playing = true;
      displayMessage(`Would you like to hit or stand? Total: ${pHand.total()}`);
      if (stand) {
        displayMessage("Player stood!");
        playing = false;
        dTurn();
      }
    } else {
      playing = false;
      displayMessage(`You busted at ${pHand.total()}`);
      determineWinner();
      clearInterval(interval);
    }
  }, 100);

  console.log("YAWDOAWDJWADOIAWJDOAWJAWOID");
  setTimeout(displayMessage("Dealers turn!"), 1000);
  // Dealer's turn
  function dTurn() {
    setInterval(function() {
      document.getElementById("dealer-cards-message").innerText = "Dealer Cards (" + dHand.total() + ")";
      if (dHand.total() < 17) {
        var card = dHand.drawCard(deck);
        displayCard(card.value, card.suit, dealerHand);
        displayMessage(`Dealer draws a card. Dealer's hand is now ${dHand.toString()} (Total: ${dHand.total()})`);
      } else {
        clearInterval(interval);
        determineWinner();
        return;
      }
    }, 1000)
  }
  // Determine the outcome
  function determineWinner() {    
    var playerTotal = pHand.total();
    var dealerTotal = dHand.total();
    console.log(playerTotal + " " + dealerTotal)
    if (playerTotal > 21) {
      displayMessage("You busted! You lose your bet.")
      return -bet;
    } else if (dealerTotal > 21 && playerTotal < 22) {
      displayMessage("dealer bust you win double bet ayayya");
      return bet; 
    } else if (playerTotal < dealerTotal) {
      displayMessage("You lose! You lose your bet.");
      return -bet;
    } else if (playerTotal > dealerTotal) {
      displayMessage("You win! You double your bet!");
      return bet;
    } else {
      displayMessage("Draw! You keep your bet. -_-");
      return 0;
    }
  }
}


// Example usage:


function displayCard(cardValue, cardSuit, hand) {
  var img = formatCard(cardValue, cardSuit);
  img.width = 75;
  img.class = "cards";
  document.getElementById(hand).appendChild(img);
}

document.getElementById('hit').onclick = function() {
  if (playing) {
    pHand.drawCard(deck); 
    displayCard(pHand.hand[pHand.hand.length - 1].value, pHand.hand[pHand.hand.length - 1].suit, playerHand);
    buttonp = true;
  }
};

document.getElementById('stand').onclick = function () {
  stand = true;
}

blackjack(100);