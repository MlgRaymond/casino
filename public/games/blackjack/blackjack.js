

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
      this.hand.push(deck.drawCard());
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

var folder = "/cards";

function blackjack(bet) {
  console.log("Making deck...");
  let deck = new Deck();
  console.log("Shuffling...\n\n");
  deck.shuffle();

  const dHand = new Hand();
  const pHand = new Hand();

  // Initial deal
  pHand.drawCard(deck);
  pHand.drawCard(deck);
  dHand.drawCard(deck);

  console.log(`The dealer's hand is ${dHand.toString()} (Total: ${dHand.total()})`);
  console.log(`\nYour hand is ${pHand.toString()} (Total: ${pHand.total()})`);

  // Player's turn
  while (pHand.total() <= 21) {
    const option = prompt("Would you like to hit (h) or stand (s)?: ").toLowerCase();
    if (option === "h") {
      pHand.drawCard(deck);
      console.log(`\nYour hand is now ${pHand.toString()} (Total: ${pHand.total()})`);
    } else if (option === "s") {
      break;
    }
  }


  // Dealer's turn
  console.log("\nDealer's turn:");
  while (dHand.total() < 17) {
    dHand.drawCard(deck);
    console.log(`Dealer draws a card. Dealer's hand is now ${dHand.toString()} (Total: ${dHand.total()})`);
  }

  // Determine the outcome
  const playerTotal = pHand.total();
  const dealerTotal = dHand.total();

  console.log(`\nYour hand: ${pHand.toString()} (Total: ${playerTotal})`);
  console.log(`Dealer's hand: ${dHand.toString()} (Total: ${dealerTotal})`);

  if (playerTotal > 21 && dealerTotal > 21) {
    console.log("Draw. You keep your bet.")
    return 0;
  } else if (playerTotal > 21 && dealerTotal < 22) {
    console.log("You lose! You lose your bet")
  } else if (dealerTotal > 21 && playerTotal < 22) {
    console.log("dealer bust you win double bet ayayya")
  }
  else if (dealerTotal > 21 || playerTotal > dealerTotal) {
    console.log("You win! You double your bet.");
    return bet;
  } else if (playerTotal < dealerTotal) {
    console.log("You lose! You lose your bet.");
    return -bet;
  } else {
    console.log("Draw! You keep your bet.");
    return 0;
  }
}

// Example usage:

var img = formatCard(5, "Spades");
var img2 = formatCard(5, "Hearts");
img.width = 75;
img2.width = 75;
document.getElementById("player-cards").appendChild(img);
document.getElementById("player-cards").appendChild(img2);

let deck = new Deck();
deck.shuffle()
let hand = new Hand(deck);



document.getElementById('hit').onclick = function() {
  if (hand.hand.length > 0) {
    hand.hand.pop();
  }
  hand.drawCard(deck);
  var img = formatCard(hand.hand[0].value, hand.hand[0].suit);
  img.width = 75;
  document.getElementById("dealer-cards").appendChild(img);
};
