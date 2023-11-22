var board = document.getElementById("boardContainerID");
var i, j;
var boardSize = 7;

// Create the board
for (i = 0; i < boardSize; ++i) {
  var row = document.createElement("div");
  row.setAttribute("id", "rowID");
  row.className = "row";

  for (j = 0; j < boardSize; ++j) {
    var cell = document.createElement("div");
    cell.setAttribute("id", "" + i + j);
    cell.className = "cell";
    row.appendChild(cell);
  }

  board.appendChild(row);
}

// Prepare the board with elements
for (i = 0; i < boardSize; ++i) {
  for (j = 0; j < boardSize; ++j) {
    // Skip center of the board
    if (i == Math.floor(boardSize / 2) && j == Math.floor(boardSize / 2)) {
      continue;
    }

    // Add player piece
    if (i == Math.floor(boardSize / 2) + 2 && j == Math.floor(boardSize / 2)) {
      var player = document.createElement("span");
      player.className = "player";
      document.getElementById("" + i + j).appendChild(player);
      continue;
    }

    var peg = document.createElement("span");
    peg.className = "peg";
    document.getElementById("" + i + j).appendChild(peg);
  }
}

// Function to perform Move
// Takes the current player position and a cell to be moved to

// Function to return valid Moves
// Takes the current player position and returns a list of cells to which player can move
