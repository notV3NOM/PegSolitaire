export class ThemeSwitcher {
  constructor() {
    this.starsId = "starsCSS";
    this.wavesId = "wavesCSS";
  }

  // Function to initialize and add event handler for theme change
  initThemeSwitch() {
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
    this.handleThemeCSSLoading(theme);

    const toggle = document.getElementById("toggleInputID");
    toggle.checked = theme === "dark" ? true : false;
    toggle.addEventListener("change", (e) => {
      const theme = e.target.checked ? "dark" : "light";
      document.body.className = theme === "dark" ? "dark-mode" : "";
      localStorage.setItem("theme", theme);
      this.handleThemeCSSLoading(theme);
    });
  }

  loadStars() {
    if (!document.getElementById(this.starsId)) {
      const head = document.getElementsByTagName("head")[0];
      const link = document.createElement("link");
      link.id = this.starsId;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "stars.css";
      link.media = "all";
      head.appendChild(link);
    }
  }

  removeStars() {
    document.getElementById(this.starsId)?.remove();
  }

  loadWaves() {
    if (!document.getElementById(this.wavesId)) {
      const head = document.getElementsByTagName("head")[0];
      const link = document.createElement("link");
      link.id = this.wavesId;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "waves.css";
      link.media = "all";
      head.appendChild(link);
    }
  }

  removeWaves() {
    document.getElementById(this.wavesId)?.remove();
  }

  handleThemeCSSLoading(theme) {
    if (theme === "dark") {
      this.removeWaves();
      this.loadStars();
    } else {
      this.removeStars();
      this.loadWaves();
    }
  }
}
