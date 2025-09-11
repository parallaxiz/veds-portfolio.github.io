export default class ProjectsPopup {
  constructor(scene) {
    this.scene = scene;
    this.open = false;

    // Check if popup already exists
    this.container = document.getElementById("projects-popup");
    if (!this.container) {
      // Create container
      this.container = document.createElement("div");
      this.container.id = "projects-popup";
      this.container.classList.add("projects-popup");

      // Create content
      this.content = document.createElement("div");
      this.content.classList.add("popup-content");
      this.content.innerHTML = `
        <img src="assets/projects_bg.png" class="popup-bg" alt="Popup Background" />
        <h2>My Projects</h2>
        <p>Here you can showcase your portfolio projects.</p>
        <button id="close-projects-popup" class="close-btn">X</button>
      `;

      this.container.appendChild(this.content);
      document.body.appendChild(this.container);
    }

    // Close button
    this.closeBtn = this.container.querySelector("#close-projects-popup");
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
    }

    // Click outside content to close
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.hide();
    });

    // Start hidden
    this.hide();
  }

  show() {
    this.container.style.display = "flex";
    this.open = true;
  }

  hide() {
    this.container.style.display = "none";
    this.open = false;
  }

  triggerClose() {
    this.hide();
  }

  update() {
    // Reserved for animations or dynamic updates
  }
}
