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
      document.getElementById("guide").style.display = "none";
    } else if (event.key === "p") {
      toggleCommandPalette();
    } else if (event.key === "g") {
      document.getElementById("guide").style.display =
        document.getElementById("guide").style.display === "none"
          ? "block"
          : "none";
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

  document.getElementById("guide").style.display = "none";

  // Function to toggle guide visibility
  function toggleGuide() {
    const guideElement = document.getElementById("guide");

    // Toggle the display property
    guideElement.style.display =
      guideElement.style.display === "none" ? "block" : "none";
  }

  // Event listener on document to handle clicks
  document.addEventListener("click", function (event) {
    const guideButton = document.getElementById("guideBtnID");
    const guideElement = document.getElementById("guide");

    // Check if the clicked element is the guide button
    if (event.target === guideButton) {
      toggleGuide();
    } else {
      // Check if the clicked element is inside the guide
      if (!guideElement.contains(event.target)) {
        // Clicked outside the guide, close it
        guideElement.style.display = "none";
      }
    }
  });
};

export { initCommandPalette, toggleCommandPalette };
