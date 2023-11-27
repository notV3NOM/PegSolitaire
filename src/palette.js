export var selectedIndex = 0;

// To open/close command palette
function toggleCommandPalette() {
  selectedIndex = 0;
  const commandPalette = document.getElementById("commandPalette");
  commandPalette.style.display =
    commandPalette.style.display === "block" ? "none" : "block";
}

const initCommandPalette = () => {
  selectedIndex = 0;

  // Listener to catch key presses to open/close command palette
  document.addEventListener("keydown", function (event) {
    const commandPalette = document.getElementById("commandPalette");
    if (event.key === "Escape") {
      commandPalette.style.display = "none";
    } else if (event.key === "p") {
      toggleCommandPalette();
    }
  });

  // Close command palette if clicked outside
  document.addEventListener("click", function (event) {
    const commandPalette = document.getElementById("commandPalette");
    if (
      event.target !== commandPalette &&
      !commandPalette.contains(event.target)
    ) {
      commandPalette.style.display = "none";
    }
  });

  // Navigate inside command palette with arrow keys
  document.addEventListener("keydown", function (event) {
    if (document.getElementById("commandPalette").style.display === "block") {
      const commands = document.querySelectorAll(".command");

      if (event.key === "ArrowUp" && selectedIndex > 0) {
        selectedIndex--;
      } else if (
        event.key === "ArrowDown" &&
        selectedIndex < commands.length - 1
      ) {
        selectedIndex++;
      }

      commands.forEach((command, index) => {
        if (index === selectedIndex) {
          command.classList.add("selected");
        } else {
          command.classList.remove("selected");
        }
      });

      if (event.key === "Enter") {
        commands[selectedIndex].click();
      }
    }
  });

  document.getElementById("switchTheme").onclick = function () {
    toggleCommandPalette();
    document.getElementById("toggleInputID").checked =
      !document.getElementById("toggleInputID").checked;
    document.getElementById("toggleInputID").dispatchEvent(new Event("change"));
  };
};

export { initCommandPalette, toggleCommandPalette };
