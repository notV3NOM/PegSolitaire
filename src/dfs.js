import { PegSolitaireBoard } from "./board";

export class PegSolitaireDFS {
  constructor(pegSolitaireBoardInstance) {
    this.pegSolitaireBoardInstance = pegSolitaireBoardInstance;
    this.visited = [];
    this.memoryMap = new Map();
    this.execTime = 0;
    this.cellMapping = new Map();
    this.MakeMap();
  }

  MakeMap = () => {
    let count = -1;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (PegSolitaireBoard.InsideBoard([i, j])) {
          ++count;
          this.cellMapping.set("" + i + j, count);
        }
      }
    }
  };

  dfs(board) {
    const stack = [{ board, steps: 0 }];

    while (stack.length > 0) {
      const { board, steps } = stack.pop();

      this.pegSolitaireBoardInstance.SetBoardState(board);

      if (33 - PegSolitaireBoard.EmptyPegs() === 1) {
        return true;
      }

      if (!this.visited.includes(board)) {
        this.visited.push(board);
      }

      const possibleMoves = PegSolitaireBoard.AllowedMoves();

      possibleMoves.forEach(([from, to]) => {
        this.pegSolitaireBoardInstance.SetBoardState(board);
        this.pegSolitaireBoardInstance.MovePeg(from, to);
        let newBoard = PegSolitaireBoard.GetBoardState();

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
    const foundSolution = this.dfs();
    this.execTime = performance.now() - startTime;

    if (!foundSolution) {
      console.log("No solution found.");
    }
  }

  reconstructPath() {
    let path = [PegSolitaireBoard.finalState];
    let u = this.memoryMap.get(PegSolitaireBoard.finalState);
    while (u) {
      path.push(u);
      u = this.memoryMap.get(u);
    }
    return path.reverse();
  }

  static findMove = (oldBoard, newBoard) => {
    const oldArray = oldBoard.split("").map(Number);
    const newArray = newBoard.split("").map(Number);

    let diff = oldArray.reduce((acc, value, index) => {
      if (value !== newArray[index]) {
        acc.push(index);
      }
      return acc;
    }, []);

    let pegs = diff.map((val) => {
      let temp = [...this.cellMapping].find(([key, value]) => val === value)[0];
      return temp;
    });

    let destination = pegs.find(
      (peg) => oldArray[this.cellMapping.get(peg)] === 0
    );

    let source =
      pegs[0] === destination
        ? [Number(pegs[2][0]), Number(pegs[2][1])]
        : [Number(pegs[0][0]), Number(pegs[0][1])];

    return [source, [Number(destination[0]), Number(destination[1])]];
  };

  displayDfsSolution = async () => {
    this.pegSolitaireBoardInstance.UpdateDfsReport(
      this.visited.length,
      this.execTime
    );
    this.pegSolitaireBoardInstance.ResetBoard();
    let solutionPath = this.reconstructPath();
    PegSolitaireBoard.updateStatusWithDot("DFS : Displaying");
    await PegSolitaireBoard.sleep(2000);
    for (let i = 1; i < solutionPath.length; ++i) {
      let m = PegSolitaireDFS.findMove(solutionPath[i - 1], solutionPath[i]);
      // validMoveChecker(m[0], m[1]);
      PegSolitaireBoard.MovePegForce(m[0], m[1]);
      await PegSolitaireBoard.sleep(1000);
    }
    PegSolitaireBoard.updateStatusWithDot("Idle");
  };

  static validMoveChecker = (startingPos, EndPos) => {
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
}
