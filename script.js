const cohortName = "YOUR COHORT NAME HERE"; // Replace with your actual cohort name
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/players`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    
    // Assume renderPlayers is a function you will create to update the page with player data.
    renderPlayers(data.players); // Pass the array of players to the render function

    return data.players; // Return the players data for any further processing
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

// This function takes an array of player objects and renders them to the DOM
function renderPlayers(players) {
  const rosterElement = document.getElementById('roster'); // Get the roster element from the DOM
  rosterElement.innerHTML = ''; // Clear any existing content
  
  players.forEach(player => {
    // Create the HTML elements for each player's card
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    
    // Populate the player card with player data
    playerCard.innerHTML = `
      <img src="${player.imageUrl}" alt="${player.name}">
      <h3>${player.name}</h3>
      <p>Breed: ${player.breed}</p>
      <button onclick="showPlayerDetails(${player.id})">Details</button>
    `;
    
    // Append the player card to the roster element
    rosterElement.appendChild(playerCard);
  });
}

// Placeholder for the showPlayerDetails function
function showPlayerDetails(playerId) {
  // Code to fetch and display the details of the player with the given playerId
}

// You can call the function to test
fetchAllPlayers().then(players => console.log(players));


/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const playerData = await response.json();
    return playerData; // or handle rendering the single player data as needed
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const addedPlayer = await response.json();
    return addedPlayer; // The newly added player's data from the API
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerId}`, {
      method: 'DELETE', // Specifies the method to remove a player
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(`Player #${playerId} removed successfully.`);
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};


/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Clear current contents

  if (playerList.length === 0) {
    main.textContent = 'No players found.';
    return;
  }

  playerList.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';

    card.innerHTML = `
      <img src="${player.image}" alt="${player.name}">
      <h2>${player.name}</h2>
      <p>ID: ${player.id}</p>
      <button onclick="renderSinglePlayer(${player.id})">See details</button>
      <button onclick="removePlayer(${player.id}).then(fetchAllPlayers)">Remove from roster</button>
    `;

    main.appendChild(card);
  });
};


/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Clear the main area

  const playerCard = document.createElement('div');
  playerCard.className = 'player-card';

  playerCard.innerHTML = `
    <img src="${player.image}" alt="Image of ${player.name}">
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <p>Team: ${player.teamName || 'Unassigned'}</p>
    <button onclick="fetchAllPlayers()">Back to all players</button>
  `;

  main.appendChild(playerCard);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  const form = document.getElementById('new-player-form');
  form.innerHTML = `
    <input type="text" id="player-name" placeholder="Name" required />
    <input type="text" id="player-breed" placeholder="Breed" required />
    <input type="text" id="player-image" placeholder="Image URL" />
    <button type="submit">Add Player</button>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const playerData = {
      name: document.getElementById('player-name').value,
      breed: document.getElementById('player-breed').value,
      image: document.getElementById('player-image').value || undefined
    };

    try {
      await addNewPlayer(playerData);
      await fetchAllPlayers().then(renderAllPlayers);
    } catch (err) {
      console.error("Uh oh, trouble adding the new player!", err);
    }
  };
};


/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
//no changes