export class PegSolitaireBoard {
  constructor() {
    this.board = document.getElementById("boardContainerID");
    this.textContainer = document.getElementById("textContainerID");
    this.nMoves = 0;
    this.lifeTime = 1000;
    this.sleepTime = 100;
    this.nExperiments = 1;
    this.avgMoves = 0;
    this.avgPegsRemaining = 0;
    this.boardState = "";
    this.boardHistory = [PegSolitaireBoard.defaultStartingState];
    this.sourcePeg = [-1, -1];
    this.userMoves = 0;
    PegSolitaireBoard.InitializeBoard();
    this.textContainer.textContent = `
  Welcome to Peg Solitaire ! \n
  Click on the buttons below to start
`;
  }

  static get defaultStartingState() {
    return "111111111111111101111111111111111";
  }

  static get finalState() {
    return "000000000000000010000000000000000";
  }

  static get boardSize() {
    return 7;
  }

  // Create the board
  static InitializeBoard = () => {
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      const row = document.createElement("div");
      row.setAttribute("id", "rowID");
      row.className = "row";

      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        const cell = document.createElement("div");
        cell.setAttribute("id", "" + i + j);
        cell.className = "cell";
        row.appendChild(cell);
      }

      document.getElementById("boardContainerID").appendChild(row);
    }

    // Prepare the board with pegs
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        // Skip center of the board
        if (
          i == Math.floor(PegSolitaireBoard.boardSize / 2) &&
          j == Math.floor(PegSolitaireBoard.boardSize / 2)
        ) {
          continue;
        }

        var peg = document.createElement("span");
        peg.className = "peg";
        // peg.textContent = "" + i + j;
        document.getElementById("" + i + j).appendChild(peg);
      }
    }
  };

  // Function to check if position is inside board
  static InsideBoard = (position) => {
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

  // Function to check if peg exists on position
  static IsEmpty = (position) => {
    if (
      document.getElementById("" + position[0] + position[1]).hasChildNodes()
    ) {
      return false;
    }
    return true;
  };

  // Function to "add" tuples
  static Add = (a, b) => {
    return [a[0] + b[0], a[1] + b[1]];
  };

  // Function to check "equal"
  static Equal = (a, b) => {
    if (a[0] == b[0] && a[1] == b[1]) {
      return true;
    }
    return false;
  };

  // Function to return valid Moves
  // Uses the current player position and returns a list of cells to which player can move
  static GetValidMoves = (playerPosition) => {
    if (
      !PegSolitaireBoard.InsideBoard(playerPosition) ||
      PegSolitaireBoard.IsEmpty(playerPosition)
    ) {
      return [];
    }

    const moveOffsets = [
      [-2, 0], // move up
      [2, 0], // move down
      [0, -2], // move left
      [0, 2], // move right
    ];

    return moveOffsets.reduce((validMoves, offset) => {
      const move = PegSolitaireBoard.Add(playerPosition, offset);
      if (
        PegSolitaireBoard.InsideBoard(move) &&
        PegSolitaireBoard.IsEmpty(move)
      ) {
        validMoves.push(move);
      }
      return validMoves;
    }, []);
  };

  // Function to remove peg
  static RemovePeg = (position) => {
    let peg = document.getElementById("" + position[0] + position[1]);
    if (peg.firstChild) {
      peg.removeChild(peg.firstChild);
    }
  };

  // Function to find pegs between given two pegs while making a move
  static FindBetweenPeg = (startingPos, EndPos) => {
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

  // Function to count empty Pegs
  static EmptyPegs = () => {
    let count = 0;
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        if (
          PegSolitaireBoard.InsideBoard([i, j]) &&
          PegSolitaireBoard.IsEmpty([i, j])
        ) {
          count++;
        }
      }
    }
    return count;
  };

  // Function to setup stats
  UpdateStats = () => {
    this.textContainer.textContent = `
    ${this.nMoves} move(s) done \n
    Pegs Remaining :  ${33 - PegSolitaireBoard.EmptyPegs()}
    `;
  };

  // Function to perform Move
  // Takes a cell to be moved to and moves the player
  MovePeg = (startPos, endPos) => {
    const validMove = PegSolitaireBoard.GetValidMoves(startPos).find((move) =>
      PegSolitaireBoard.Equal(move, endPos)
    );

    if (validMove) {
      PegSolitaireBoard.RemovePeg(endPos);
      PegSolitaireBoard.RemovePeg(startPos);
      PegSolitaireBoard.RemovePeg(
        PegSolitaireBoard.FindBetweenPeg(startPos, endPos)
      );
      const peg = document.createElement("span");
      peg.className = "movedPeg";
      document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
      this.nMoves++;
      this.UpdateStats();
      return true;
    } else {
      console.log("Attempted invalid move ", startPos, endPos);
      console.log(
        "Valid moves were ",
        PegSolitaireBoard.GetValidMoves(startPos)
      );
      return false;
    }
  };

  // Function to perform Move without validation
  static MovePegForce = (startPos, endPos) => {
    PegSolitaireBoard.RemovePeg(endPos);
    PegSolitaireBoard.RemovePeg(startPos);
    PegSolitaireBoard.RemovePeg(
      PegSolitaireBoard.FindBetweenPeg(startPos, endPos)
    );
    var peg = document.createElement("span");
    peg.className = "movedPeg";
    document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
  };

  // Function to find all possible moves which remove a peg
  static AllowedMoves = () => {
    let allowedMoves = [];

    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        const startPos = [i, j];
        const validMoves = PegSolitaireBoard.GetValidMoves(startPos);

        if (validMoves.length) {
          validMoves.forEach((endPos) => {
            const betweenPeg = PegSolitaireBoard.FindBetweenPeg(
              startPos,
              endPos
            );

            if (!PegSolitaireBoard.IsEmpty(betweenPeg)) {
              allowedMoves.push([startPos, endPos]);
            }
          });
        }
      }
    }

    return allowedMoves;
  };

  // Function to find all pegs that can be moved
  static MoveablePegsActual = () => {
    const moveablePegsSet = new Set();

    PegSolitaireBoard.AllowedMoves().forEach(([source, _]) => {
      moveablePegsSet.add("" + source[0] + source[1]);
    });

    return Array.from(moveablePegsSet, (move) => [
      Number(move[0]),
      Number(move[1]),
    ]);
  };

  // Function to perform Random Move
  RandomMove = () => {
    let allowedMoves = PegSolitaireBoard.AllowedMoves();
    if (!allowedMoves.length) return;
    let randomElement =
      allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
    this.MovePeg(randomElement[0], randomElement[1]);
  };

  // Function to clear all cells
  static ClearCells = () => {
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        document.getElementById("" + i + j).className = "cell";
      }
    }
  };

  // Function to clear all event listeners
  ClearListeners = () => {
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        const lastMove = document.getElementById("" + i + j).firstChild;
        if (lastMove && lastMove.className === "movedPeg") {
          lastMove.className = "peg";
        }
      }
    }
    this.board.innerHTML = this.board.innerHTML;
  };

  // Function to add report
  UpdateReport = () => {
    this.textContainer.textContent = `
    Report
    Strategy : Greedy with Random Moves
    Number of Experiments : ${this.nExperiments}
    Average Moves per experiment : ${this.avgMoves / this.nExperiments}
    Average No of Pegs remaining : ${this.avgPegsRemaining / this.nExperiments}
    `;
  };

  // Function to add dfs report
  UpdateDfsReport = (steps, time) => {
    this.textContainer.textContent = `
    Report
    Strategy : DFS
    Number of states explored : ${steps}
    Time taken : ${time} ms
    `;
  };

  static sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Function to Reset Board
  ResetBoard = () => {
    this.nMoves = 0;
    this.board.replaceChildren();
    PegSolitaireBoard.InitializeBoard();
  };

  // Random Agent Lifecycle
  RunRandomGame = async () => {
    for (let k = 0; k < this.lifeTime; k++) {
      if (!PegSolitaireBoard.AllowedMoves().length) {
        break;
      }
      this.RandomMove();
      await PegSolitaireBoard.sleep(this.sleepTime);
    }
  };

  // Function to update the color of the dot based on the status text
  static updateStatusWithDot(text) {
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

  // Run Experiment
  RunExperiment = async (days) => {
    this.FullReset();
    PegSolitaireBoard.updateStatusWithDot("Random Agent : Running");
    document.getElementById("randomBtn").style.display = "none";
    document.getElementById("dfsBtn").style.display = "none";
    document.getElementById("manualBtn").style.display = "none";
    this.nExperiments = days;
    this.avgMoves = 0;
    this.avgPegsRemaining = 0;
    for (let k = 0; k < this.nExperiments; ++k) {
      this.ResetBoard();
      await this.RunRandomGame();
      this.avgMoves += this.nMoves;
      this.avgPegsRemaining += 33 - PegSolitaireBoard.EmptyPegs();
    }
    this.UpdateReport();
    PegSolitaireBoard.updateStatusWithDot("Idle");
  };

  // Function to calculate boardState
  static GetBoardState = () => {
    let state = "";
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        if (PegSolitaireBoard.InsideBoard([i, j])) {
          state += PegSolitaireBoard.IsEmpty([i, j]) ? "0" : "1";
        }
      }
    }
    return state;
  };

  // Function to set boardState
  SetBoardState = (state) => {
    this.board.replaceChildren();

    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      var row = document.createElement("div");
      row.setAttribute("id", "rowID");
      row.className = "row";

      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        var cell = document.createElement("div");
        cell.setAttribute("id", "" + i + j);
        cell.className = "cell";
        row.appendChild(cell);
      }

      this.board.appendChild(row);
    }

    let counter = 0;
    for (let i = 0; i < PegSolitaireBoard.boardSize; ++i) {
      for (let j = 0; j < PegSolitaireBoard.boardSize; ++j) {
        if (PegSolitaireBoard.InsideBoard([i, j])) {
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

  // Util function to add source event listener
  PrepareSourceInput = () => {
    this.ClearListeners();
    const abortSourceControllers = new AbortController();
    let len = PegSolitaireBoard.AllowedMoves().length;

    if (len) {
      this.textContainer.textContent = `
    ${this.userMoves} moves done
    ${len} legal moves can be performed 
    `;
      PegSolitaireBoard.MoveablePegsActual().forEach((peg) => {
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

        pegElement.addEventListener("click", () => {
          pegElement.className = "selectedPeg";
          this.sourcePeg = [peg[0], peg[1]];
          PegSolitaireBoard.MoveablePegsActual().forEach((remainingPeg) => {
            if (!PegSolitaireBoard.Equal(peg, remainingPeg)) {
              document.getElementById(
                "" + remainingPeg[0] + remainingPeg[1]
              ).firstChild.className = "peg";
            }
          });
          abortSourceControllers.abort();
          this.PrepareDestinationInput();
        });
      });
    } else {
      if (PegSolitaireBoard.EmptyPegs() == 32) {
        this.textContainer.textContent = ` 
      Completed Successfully ! \n
      ${this.userMoves} move(s) done
      `;
        document.getElementById("celebrations").style.display = "";
      } else {
        this.textContainer.textContent = ` 
        Finished
        ${this.userMoves} move(s) done \n
        Pegs Remaining :  ${33 - PegSolitaireBoard.EmptyPegs()}
        `;
      }
      document.getElementById("undoBtn").style.display = "none";
      PegSolitaireBoard.updateStatusWithDot("Idle");
      this.boardHistory = [];
      this.boardHistory.push(PegSolitaireBoard.defaultStartingState);
    }
  };

  // Util function to add destination event listener
  PrepareDestinationInput = () => {
    this.ClearListeners();
    const abortDestinationControllers = new AbortController();

    let allowedMoves = PegSolitaireBoard.AllowedMoves();
    let allowedDestinations = new Set();
    allowedMoves.forEach(([source, destination]) => {
      if (PegSolitaireBoard.Equal(this.sourcePeg, source)) {
        allowedDestinations.add("" + destination[0] + destination[1]);
      }
    });

    allowedDestinations.forEach((destination) => {
      const destinationElement = document.getElementById(
        "" + destination[0] + destination[1]
      );

      destinationElement.addEventListener("click", () => {
        PegSolitaireBoard.RemovePeg(this.sourcePeg);
        PegSolitaireBoard.RemovePeg([
          Number(destination[0]),
          Number(destination[1]),
        ]);
        PegSolitaireBoard.RemovePeg(
          PegSolitaireBoard.FindBetweenPeg(this.sourcePeg, [
            Number(destination[0]),
            Number(destination[1]),
          ])
        );
        PegSolitaireBoard.ClearCells();
        var peg = document.createElement("span");
        peg.className = "movedPeg";
        destinationElement.appendChild(peg);
        this.userMoves++;
        this.boardHistory.push(PegSolitaireBoard.GetBoardState());
        abortDestinationControllers.abort();
        this.PrepareSourceInput();
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
          PegSolitaireBoard.RemovePeg(this.sourcePeg);
          PegSolitaireBoard.RemovePeg([
            Number(destination[0]),
            Number(destination[1]),
          ]);
          PegSolitaireBoard.RemovePeg(
            PegSolitaireBoard.FindBetweenPeg(this.sourcePeg, [
              Number(destination[0]),
              Number(destination[1]),
            ])
          );
          PegSolitaireBoard.ClearCells();
          var peg = document.createElement("span");
          peg.className = "movedPeg";
          destinationElement.appendChild(peg);
          this.userMoves++;
          this.boardHistory.push(PegSolitaireBoard.GetBoardState());
          abortDestinationControllers.abort();
          this.PrepareSourceInput();
        },
        {
          signal: abortDestinationControllers.signal,
        }
      );
      destinationElement.className = "allowedCell";
    });

    let sourcePegElement = document.getElementById(
      "" + this.sourcePeg[0] + this.sourcePeg[1]
    );

    sourcePegElement.addEventListener("mouseout", () => {
      PegSolitaireBoard.ClearCells();
      abortDestinationControllers.abort();
      this.PrepareSourceInput();
    });

    sourcePegElement.addEventListener("touchstart", (e) => {
      e.preventDefault();
      PegSolitaireBoard.ClearCells();
      abortDestinationControllers.abort();
      this.PrepareSourceInput();
    });

    sourcePegElement.addEventListener("drag", (e) => {
      e.target.classList.add("dragging");
    });

    sourcePegElement.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
  };

  // Function to Undo move
  UndoMove = () => {
    if (this.boardHistory.length > 1) {
      this.SetBoardState(this.boardHistory.at(-2));
      this.boardHistory.pop();
      this.userMoves--;
      this.PrepareSourceInput();
    }
  };

  // Function to play in manual mode
  ManualMode = () => {
    this.FullReset();
    PegSolitaireBoard.updateStatusWithDot("Manual Mode");
    document.getElementById("undoBtn").style.display = "unset";
    document.getElementById("randomBtn").style.display = "none";
    document.getElementById("dfsBtn").style.display = "none";
    document.getElementById("manualBtn").style.display = "none";
    this.PrepareSourceInput();
  };

  // Util function to handle full reset
  FullReset = () => {
    if (
      document.getElementById("status").textContent === "Idle" ||
      document.getElementById("status").textContent === "Manual Mode"
    ) {
      this.sourcePeg = [-1, -1];
      this.userMoves = 0;
      this.ResetBoard();
      this.textContainer.textContent = `
  Welcome to Peg Solitaire ! \n
  Click on the buttons below to start
    `;
      PegSolitaireBoard.updateStatusWithDot("Idle");
      document.getElementById("undoBtn").style.display = "none";
      document.getElementById("randomBtn").style.display = "unset";
      document.getElementById("dfsBtn").style.display = "unset";
      document.getElementById("manualBtn").style.display = "unset";
      this.boardHistory = [];
      this.boardHistory.push(PegSolitaireBoard.defaultStartingState);
    } else {
      window.location.reload();
    }
  };
}
