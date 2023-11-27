import { PegSolitaireBoard } from "./board.js";
import { ThemeSwitcher } from "./theme.js";
import { PegSolitaireDFS } from "./dfs.js";
import "./palette.js";

const pegSolitaireBoard = new PegSolitaireBoard();
const themeSwitcher = new ThemeSwitcher();
themeSwitcher.initThemeSwitch();

const addClickListener = (id, callback) => {
  const element = document.getElementById(id);
  element.onclick = () => {
    toggleCommandPalette();
    callback();
  };
};

const runDFS = () => {
  pegSolitaireBoard.ResetBoard();
  PegSolitaireBoard.updateStatusWithDot("DFS : Exploring");
  document.getElementById("randomBtn").style.display = "none";
  document.getElementById("dfsBtn").style.display = "none";
  document.getElementById("manualBtn").style.display = "none";
  document.getElementById("textContainerID").textContent = "Exploring...";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const pegSolitaireDFS = new PegSolitaireDFS(pegSolitaireBoard);
      pegSolitaireDFS.findSolution();
      pegSolitaireDFS.displayDfsSolution();
    });
  });
};

addClickListener("manualBtn", pegSolitaireBoard.ManualMode);
addClickListener("randomBtn", () => pegSolitaireBoard.RunExperiment(1));
addClickListener("dfsBtn", runDFS);
addClickListener("resetBtn", () => pegSolitaireBoard.FullReset());
addClickListener("undoBtn", () => pegSolitaireBoard.UndoMove());
document.getElementById("undoBtn").style.display = "none";

addClickListener("startRandomAgent", () => pegSolitaireBoard.RunExperiment(1));
addClickListener("start5RandomAgents", () =>
  pegSolitaireBoard.RunExperiment(5)
);
addClickListener("startManualMode", pegSolitaireBoard.ManualMode);
addClickListener("startDFS", runDFS);
addClickListener("undoMove", () => pegSolitaireBoard.UndoMove());
addClickListener("fullReset", () => pegSolitaireBoard.FullReset());
