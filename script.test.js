const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});
describe("fetchSinglePlayer", () => {
  let player;
  beforeAll(async () => {
    
    player = await fetchSinglePlayer(YOUR_PLAYER_ID);
  });

  test("returns an object with name and id", async () => {
    expect(player).toHaveProperty("name");
    expect(player).toHaveProperty("id");
  });

  
});

describe("addNewPlayer", () => {
  let newPlayer;
  beforeAll(async () => {
   
    newPlayer = await addNewPlayer(YOUR_PLAYER_DATA);
  });

  test("returns an object with name and id", async () => {
    expect(newPlayer).toHaveProperty("name");
    expect(newPlayer).toHaveProperty("id");
  });

  
});

// (Optional) Tests for removePlayer
describe("removePlayer", () => {
  let removedPlayer;
  beforeAll(async () => {
    // Replace 'YOUR_PLAYER_ID' with a valid player ID to test the function
    removedPlayer = await removePlayer(YOUR_PLAYER_ID);
  });

  test("returns a success message or status code", async () => {
    
    expect(removedPlayer).toBe("Player removed successfully");
  });

  
});

//no changes