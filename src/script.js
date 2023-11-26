var board = document.getElementById("boardContainerID");
var textContainer = document.getElementById("textContainerID");
var i, j, k, playerPosition;
var boardSize = 7;
var nMoves = 0;
var lifeTime = 1000;
var sleepTime = 100;
var nExperiments = 1;
var avgMoves = 0;
var avgPegsRemaining = 0;
var starsId = "starsCSS";
var wavesId = "wavesCSS";
var boardHistory = [];
var boardState = "";
const startingState = "111111111111111101111111111111111";
var cellMapping = new Map();

// Create the board
var InitializeBoard = () => {
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

  // Prepare the board with pegs
  for (i = 0; i < boardSize; ++i) {
    for (j = 0; j < boardSize; ++j) {
      // Skip center of the board
      if (i == Math.floor(boardSize / 2) && j == Math.floor(boardSize / 2)) {
        continue;
      }

      var peg = document.createElement("span");
      peg.className = "peg";
      // peg.textContent = "" + i + j;
      document.getElementById("" + i + j).appendChild(peg);
    }
  }
};

// Function to return valid Moves
// Uses the current player position and returns a list of cells to which player can move
var GetValidMoves = (playerPosition) => {
  if (!InsideBoard(playerPosition) || IsEmpty(playerPosition)) {
    return [];
  }

  const moveOffsets = [
    [-2, 0], // move up
    [2, 0], // move down
    [0, -2], // move left
    [0, 2], // move right
  ];

  return moveOffsets.reduce((validMoves, offset) => {
    const move = Add(playerPosition, offset);
    if (InsideBoard(move) && IsEmpty(move)) {
      validMoves.push(move);
    }
    return validMoves;
  }, []);
};

// Function to perform Move
// Takes a cell to be moved to and moves the player
var MovePeg = (startPos, endPos) => {
  const validMove = GetValidMoves(startPos).find((move) => Equal(move, endPos));

  if (validMove) {
    RemovePeg(endPos);
    RemovePeg(startPos);
    RemovePeg(FindBetweenPeg(startPos, endPos));
    const peg = document.createElement("span");
    peg.className = "movedPeg";
    document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
    nMoves++;
    UpdateStats();
    return true;
  } else {
    console.log("Attempted invalid move ", startPos, endPos);
    console.log("Valid moves were ", GetValidMoves(startPos));
    return false;
  }
};

// Function to perform Move without validation
var MovePegForce = (startPos, endPos) => {
  RemovePeg(endPos);
  RemovePeg(startPos);
  RemovePeg(FindBetweenPeg(startPos, endPos));
  var peg = document.createElement("span");
  peg.className = "movedPeg";
  document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
};

// Util Function to "add" tuples
var Add = (a, b) => {
  return [a[0] + b[0], a[1] + b[1]];
};

// Util Function to check "equal"
var Equal = (a, b) => {
  if (a[0] == b[0] && a[1] == b[1]) {
    return true;
  }
  return false;
};

// Util Function to check if position is inside board
var InsideBoard = (position) => {
  if (
    position[0] < 0 ||
    position[0] > 6 ||
    position[1] < 0 ||
    position[1] > 6
  ) {
    return false;
  }
  if (
    (position[0] < 2 && position[1] < 2) ||
    (position[0] < 2 && position[1] > 4) ||
    (position[0] > 4 && position[1] < 2) ||
    (position[0] > 4 && position[1] > 4)
  ) {
    return false;
  }
  return true;
};

// Util Function to check if peg exists on position
var IsEmpty = (position) => {
  if (document.getElementById("" + position[0] + position[1]).hasChildNodes()) {
    return false;
  }
  return true;
};

// Util Function to remove peg
var RemovePeg = (position) => {
  let peg = document.getElementById("" + position[0] + position[1]);
  if (peg.firstChild) {
    peg.removeChild(peg.firstChild);
  }
};

// Util Function to find pegs between given two pegs while making a move
var FindBetweenPeg = (startingPos, EndPos) => {
  if (startingPos[0] === EndPos[0] && startingPos[1] < EndPos[1]) {
    return [startingPos[0], startingPos[1] + 1];
  } else if (startingPos[0] === EndPos[0] && startingPos[1] > EndPos[1]) {
    return [startingPos[0], startingPos[1] - 1];
  }
  if (startingPos[1] === EndPos[1] && startingPos[0] < EndPos[0]) {
    return [startingPos[0] + 1, startingPos[1]];
  } else if (startingPos[1] === EndPos[1] && startingPos[0] > EndPos[0]) {
    return [startingPos[0] - 1, startingPos[1]];
  }
};

// Util Function to find all pegs that can be moved
var MoveablePegsActual = () => {
  let moveablePegs = new Set();
  let allowedMoves = AllowedMoves();
  let moveablePegsList = [];

  allowedMoves.forEach(([source, destination]) => {
    moveablePegs.add("" + source[0] + source[1]);
  });
  moveablePegs.forEach((move) => {
    moveablePegsList.push([Number(move[0]), Number(move[1])]);
  });
  return moveablePegsList;
};

var MoveablePegs = () => {
  let moveablePegs = [];
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (GetValidMoves([i, j]).length) {
        moveablePegs.push([i, j]);
      }
    }
  }
  return moveablePegs;
};

// Util Function to find all possible moves which remove a peg
var AllowedMoves = () => {
  let allowedMoves = [];
  MoveablePegs().forEach((startPos) => {
    GetValidMoves(startPos).forEach((endPos) => {
      if (!IsEmpty(FindBetweenPeg(startPos, endPos))) {
        allowedMoves.push([startPos, endPos]);
      }
    });
  });
  return allowedMoves;
};

// Util Function to perform Random Move
var RandomMove = () => {
  let allowedMoves = AllowedMoves();
  if (!allowedMoves.length) return;
  let randomElement =
    allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
  MovePeg(randomElement[0], randomElement[1]);
};

// Util Function to count empty Pegs
var EmptyPegs = () => {
  let count = 0;
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (InsideBoard([i, j]) && IsEmpty([i, j])) {
        count++;
      }
    }
  }
  return count;
};

// Util Function to clear all cells
var ClearCells = () => {
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      document.getElementById("" + i + j).className = "cell";
    }
  }
};

// Util Function to clear all event listeners
var ClearListeners = () => {
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      let lastMove = document.getElementById("" + i + j).firstChild;
      if (lastMove && lastMove.className === "movedPeg") {
        lastMove.className = "peg";
      }
    }
  }
  board.innerHTML = board.innerHTML;
};

// Util Function to setup stats
var UpdateStats = () => {
  textContainer.textContent = `
  ${nMoves} move(s) done \n
  Pegs Remaining :  ${33 - EmptyPegs()}
  `;
};

// Util Function to add report
var UpdateReport = () => {
  textContainer.textContent = `
  Report
  Strategy : Greedy with Random Moves
  Number of Experiments : ${nExperiments}
  Average Moves per experiment : ${avgMoves / nExperiments}
  Average No of Pegs remaining : ${avgPegsRemaining / nExperiments}
  `;
};

// Util Function to add dfs report
var UpdateDfsReport = (steps, time) => {
  textContainer.textContent = `
  Report
  Strategy : DFS
  Number of states explored : ${steps}
  Time taken : ${time} ms
  `;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Util Function to Reset Board
var ResetBoard = () => {
  nMoves = 0;
  board.replaceChildren();
  InitializeBoard();
};

// Game Lifecycle
var RunGame = async () => {
  for (k = 0; k < lifeTime; k++) {
    if (!AllowedMoves().length) {
      break;
    }
    RandomMove();
    await sleep(sleepTime);
  }
};

// Run Experiment
var RunExperiment = async (days) => {
  updateStatusWithDot("Random Agent : Running");
  document.getElementById("randomBtn").style.display = "none";
  document.getElementById("dfsBtn").style.display = "none";
  document.getElementById("manualBtn").style.display = "none";
  nExperiments = days;
  avgMoves = 0;
  avgPegsRemaining = 0;
  ResetBoard();
  for (let k = 0; k < nExperiments; ++k) {
    ResetBoard();
    await RunGame();
    avgMoves += nMoves;
    avgPegsRemaining += 33 - EmptyPegs();
  }
  UpdateReport();
  updateStatusWithDot("Idle");
};

// Function to initialize and add event handler for theme change
var InitThemeSwitch = () => {
  const { matches: userPrefersDark } = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );
  let theme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : userPrefersDark
    ? "dark"
    : "light";
  document.body.className = theme === "dark" ? "dark-mode" : "";
  localStorage.setItem("theme", theme);
  HandleThemeCSSLoading(theme);

  const toggle = document.getElementById("toggleInputID");
  toggle.checked = theme === "dark" ? true : false;
  toggle.addEventListener("change", (e) => {
    const theme = e.target.checked ? "dark" : "light";
    document.body.className = theme === "dark" ? "dark-mode" : "";
    localStorage.setItem("theme", theme);
    HandleThemeCSSLoading(theme);
  });
};

// Function to load stars CSS
var LoadStars = () => {
  if (!document.getElementById(starsId)) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.id = starsId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "stars.css";
    link.media = "all";
    head.appendChild(link);
  }
};

// Function to remove stars CSS
var RemoveStars = () => {
  document.getElementById(starsId)?.remove();
};

// Function to load waves CSS
var LoadWaves = () => {
  if (!document.getElementById(wavesId)) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.id = wavesId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "waves.css";
    link.media = "all";
    head.appendChild(link);
  }
};

// Function to remove waves CSS
var RemoveWaves = () => {
  document.getElementById(wavesId)?.remove();
};

// Util function to handle theme switch
var HandleThemeCSSLoading = (theme) => {
  if (theme === "dark") {
    RemoveWaves();
    LoadStars();
  } else {
    RemoveStars();
    LoadWaves();
  }
};

// Util Function to calculate boardState
var GetBoardState = () => {
  let state = "";
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (InsideBoard([i, j])) {
        state += IsEmpty([i, j]) ? "0" : "1";
      }
    }
  }
  return state;
};

// Util Function to set boardState
var SetBoardState = (state) => {
  board.replaceChildren();

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

  let counter = 0;
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (InsideBoard([i, j])) {
        if (state[counter] == "1") {
          var peg = document.createElement("span");
          peg.className = "peg";
          document.getElementById("" + i + j).appendChild(peg);
        }
        counter++;
      }
    }
  }
};

// Function to Undo move
var UndoMove = () => {
  if (boardHistory.length > 1) {
    SetBoardState(boardHistory.at(-2));
    boardHistory.pop();
    userMoves--;
    PrepareSourceInput();
  }
};

// Initializations
InitThemeSwitch();
InitializeBoard();
textContainer.textContent = `
  Welcome to Peg Solitaire ! \n
  Click on the buttons below to start
`;
boardHistory.push(startingState);

var sourcePeg = [-1, -1];
var userMoves = 0;

// Function to play in manual mode
var ManualMode = () => {
  ResetBoard();
  updateStatusWithDot("Manual Mode");
  document.getElementById("undoBtn").style.display = "unset";
  document.getElementById("randomBtn").style.display = "none";
  document.getElementById("dfsBtn").style.display = "none";
  document.getElementById("manualBtn").style.display = "none";
  PrepareSourceInput();
};

// Util function to add source event listener
var PrepareSourceInput = () => {
  ClearListeners();
  const abortSourceControllers = new AbortController();
  let len = AllowedMoves().length;

  if (len) {
    textContainer.textContent = `
      ${userMoves} moves done
      ${AllowedMoves().length} legal moves can be performed 
    `;
    MoveablePegsActual().forEach((peg) => {
      const pegElement = document.getElementById(
        "" + peg[0] + peg[1]
      ).firstChild;
      pegElement.className = "moveablePeg";
      pegElement.draggable = true; // Enable drag-and-drop for pegs

      pegElement.addEventListener("mouseover", () => {
        pegElement.click(); // Programmatically trigger the click event
      });

      pegElement.addEventListener("touchstart", (e) => {
        e.preventDefault();
        pegElement.click(); // Programmatically trigger the click event
      });

      pegElement.addEventListener("click", function () {
        pegElement.className = "selectedPeg";
        sourcePeg = [peg[0], peg[1]];
        MoveablePegsActual().forEach((remainingPeg) => {
          if (!Equal(peg, remainingPeg)) {
            document.getElementById(
              "" + remainingPeg[0] + remainingPeg[1]
            ).firstChild.className = "peg";
          }
        });
        abortSourceControllers.abort();
        PrepareDestinationInput();
      });
    });
  } else {
    if (EmptyPegs() == 32) {
      textContainer.textContent = ` 
    Completed Successfully ! \n
    ${userMoves} move(s) done
    `;
      document.getElementById("celebrations").style.display = "";
    } else {
      textContainer.textContent = ` 
      Finished
      ${userMoves} move(s) done \n
      Pegs Remaining :  ${33 - EmptyPegs()}
      `;
    }
    document.getElementById("undoBtn").style.display = "none";
    updateStatusWithDot("Idle");
    boardHistory = [];
    boardHistory.push(startingState);
  }
};

// Util function to add destination event listener
var PrepareDestinationInput = () => {
  ClearListeners();
  const abortDestinationControllers = new AbortController();

  let allowedMoves = AllowedMoves();
  let allowedDestinations = new Set();
  allowedMoves.forEach(([source, destination]) => {
    if (Equal(sourcePeg, source)) {
      allowedDestinations.add("" + destination[0] + destination[1]);
    }
  });

  allowedDestinations.forEach((destination) => {
    const destinationElement = document.getElementById(
      "" + destination[0] + destination[1]
    );

    destinationElement.addEventListener("click", function () {
      RemovePeg(sourcePeg);
      RemovePeg([Number(destination[0]), Number(destination[1])]);
      RemovePeg(
        FindBetweenPeg(sourcePeg, [
          Number(destination[0]),
          Number(destination[1]),
        ])
      );
      ClearCells();
      var peg = document.createElement("span");
      peg.className = "movedPeg";
      destinationElement.appendChild(peg);
      userMoves++;
      boardHistory.push(GetBoardState());
      abortDestinationControllers.abort();
      PrepareSourceInput();
    });

    destinationElement.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    destinationElement.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        RemovePeg(sourcePeg);
        RemovePeg([Number(destination[0]), Number(destination[1])]);
        RemovePeg(
          FindBetweenPeg(sourcePeg, [
            Number(destination[0]),
            Number(destination[1]),
          ])
        );
        ClearCells();
        var peg = document.createElement("span");
        peg.className = "movedPeg";
        destinationElement.appendChild(peg);
        userMoves++;
        boardHistory.push(GetBoardState());
        abortDestinationControllers.abort();
        PrepareSourceInput();
      },
      {
        signal: abortDestinationControllers.signal,
      }
    );
    destinationElement.className = "allowedCell";
  });

  let sourcePegElement = document.getElementById(
    "" + sourcePeg[0] + sourcePeg[1]
  );

  sourcePegElement.addEventListener("mouseout", function () {
    ClearCells();
    abortDestinationControllers.abort();
    PrepareSourceInput();
  });

  sourcePegElement.addEventListener("touchstart", function (e) {
    e.preventDefault();
    ClearCells();
    abortDestinationControllers.abort();
    PrepareSourceInput();
  });

  sourcePegElement.addEventListener("drag", function (e) {
    e.target.classList.add("dragging");
  });

  sourcePegElement.addEventListener("dragend", function (e) {
    e.target.classList.remove("dragging");
  });
};

// Util function to handle full reset
var FullReset = () => {
  if (
    document.getElementById("status").textContent === "Idle" ||
    document.getElementById("status").textContent === "Manual Mode"
  ) {
    sourcePeg = [-1, -1];
    userMoves = 0;
    ResetBoard();
    textContainer.textContent = `
  Welcome to Peg Solitaire ! \n
  Click on the buttons below to start
    `;
    updateStatusWithDot("Idle");
    document.getElementById("undoBtn").style.display = "none";
    document.getElementById("randomBtn").style.display = "unset";
    document.getElementById("dfsBtn").style.display = "unset";
    document.getElementById("manualBtn").style.display = "unset";
    boardHistory = [];
    boardHistory.push(startingState);
  } else {
    window.location.reload();
  }
};

// Function to update the color of the dot based on the status text
function updateStatusWithDot(text) {
  document.getElementById("status").textContent = text;
  const dotElement = document.getElementById("statusDot");
  const statusText = text.toLowerCase();

  // Set the appropriate background color based on the status
  if (statusText.includes("idle")) {
    dotElement.style.backgroundColor = "green";
  } else if (
    statusText.includes("running") ||
    statusText.includes("exploring")
  ) {
    dotElement.style.backgroundColor = "red";
  } else {
    dotElement.style.backgroundColor = "blue";
  }
}

class PegSolitaire {
  constructor(initialState) {
    this.initialState = initialState;
    this.visited = [];
    this.memoryMap = new Map();
    this.execTime = 0;
  }

  dfs(board) {
    const stack = [{ board, steps: 0 }];

    while (stack.length > 0) {
      const { board, steps } = stack.pop();

      SetBoardState(board);

      if (33 - EmptyPegs() === 1) {
        return true;
      }

      if (!this.visited.includes(board)) {
        this.visited.push(board);
      }

      const possibleMoves = AllowedMoves();

      possibleMoves.forEach(([from, to]) => {
        SetBoardState(board);
        MovePeg(from, to);
        let newBoard = GetBoardState();

        this.memoryMap.set(newBoard, board);

        if (!this.visited.includes(newBoard)) {
          stack.push({ board: newBoard, steps: steps + 1 });
        }
      });
    }

    return false; // No solution found from this state
  }

  findSolution() {
    let startTime = performance.now();
    const foundSolution = this.dfs(this.initialState);
    this.execTime = performance.now() - startTime;

    if (!foundSolution) {
      console.log("No solution found.");
    }
  }

  reconstructPath() {
    let path = ["000000000000000010000000000000000"];
    let u = this.memoryMap.get("000000000000000010000000000000000");
    while (u) {
      path.push(u);
      u = this.memoryMap.get(u);
    }
    return path.reverse();
  }
}

var MakeMap = () => {
  let count = -1;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (InsideBoard([i, j])) {
        ++count;
        cellMapping.set("" + i + j, count);
      }
    }
  }
};

var RunDFS = () => {
  ResetBoard();
  updateStatusWithDot("DFS : Exploring");
  document.getElementById("randomBtn").style.display = "none";
  document.getElementById("dfsBtn").style.display = "none";
  document.getElementById("manualBtn").style.display = "none";
  textContainer.textContent = "Exploring...";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const pegSolitaireGame = new PegSolitaire(startingState);
      MakeMap();
      pegSolitaireGame.findSolution();
      displayDfsSolution(pegSolitaireGame);
    });
  });
};

var displayDfsSolution = async (pegSolitaireGame) => {
  UpdateDfsReport(pegSolitaireGame.visited.length, pegSolitaireGame.execTime);
  ResetBoard();
  let solutionPath = pegSolitaireGame.reconstructPath();
  updateStatusWithDot("DFS : Displaying");
  await sleep(2000);
  for (let i = 1; i < solutionPath.length; ++i) {
    let m = findMove(solutionPath[i - 1], solutionPath[i]);
    // ValidMoveChecker(m[0], m[1]);
    MovePegForce(m[0], m[1]);
    await sleep(1000);
  }
  pegSolitaireGame = null;
  updateStatusWithDot("Idle");
};

var findMove = (oldBoard, newBoard) => {
  const oldArray = oldBoard.split("").map(Number);
  const newArray = newBoard.split("").map(Number);

  let diff = oldArray.reduce((acc, value, index) => {
    if (value !== newArray[index]) {
      acc.push(index);
    }
    return acc;
  }, []);

  let pegs = diff.map((val) => {
    let temp = [...cellMapping].find(([key, value]) => val === value)[0];
    return temp;
  });

  let destination = pegs.find((peg) => oldArray[cellMapping.get(peg)] === 0);

  let source =
    pegs[0] === destination
      ? [Number(pegs[2][0]), Number(pegs[2][1])]
      : [Number(pegs[0][0]), Number(pegs[0][1])];

  return [source, [Number(destination[0]), Number(destination[1])]];
};

var ValidMoveChecker = (startingPos, EndPos) => {
  if (
    startingPos[0] === EndPos[0] &&
    Math.abs(startingPos[1] - EndPos[1]) === 2
  ) {
    return true;
  } else if (
    startingPos[1] === EndPos[1] &&
    Math.abs(startingPos[0] - EndPos[0]) === 2
  ) {
    return true;
  }
  console.log("Invalid move found : ", startingPos, EndPos);
  return false;
};
