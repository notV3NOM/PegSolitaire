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
    var peg = document.createElement("span");
    peg.className = "peg";
    document.getElementById("" + i + j).appendChild(peg);
  }
}
