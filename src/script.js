import { PegSolitaireBoard } from "./board.js";
import { ThemeSwitcher } from "./theme.js";
import { PegSolitaireDFS } from "./dfs.js";
import {
  selectedIndex,
  toggleCommandPalette,
  initCommandPalette,
} from "./palette.js";

const pegSolitaireBoard = new PegSolitaireBoard();
const themeSwitcher = new ThemeSwitcher();
themeSwitcher.initThemeSwitch();
initCommandPalette();

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

// Add click listeners

const addClickListener = (id, callback) => {
  const element = document.getElementById(id);
  element.onclick = () => {
    toggleCommandPalette();
    callback();
  };
};

addClickListener("manualBtn", pegSolitaireBoard.ManualMode);
addClickListener("randomBtn", () => pegSolitaireBoard.RunExperiment(1));
addClickListener("dfsBtn", runDFS);
addClickListener("resetBtn", () => pegSolitaireBoard.FullReset());
addClickListener("undoBtn", () => pegSolitaireBoard.UndoMove());
document.getElementById("undoBtn").style.display = "none";

addClickListener("start5RandomAgents", () =>
  pegSolitaireBoard.RunExperiment(5)
);
addClickListener("start10RandomAgents", () =>
  pegSolitaireBoard.RunExperiment(10)
);
addClickListener("fullReset", () => pegSolitaireBoard.FullReset());
addClickListener("toggleCelebration", () =>
  pegSolitaireBoard.ToggleCelebrations()
);
