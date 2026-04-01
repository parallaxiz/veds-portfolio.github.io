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

      // Create content wrapper
      this.content = document.createElement("div");
      this.content.classList.add("popup-content");
      this.content.innerHTML = `
        <div id="projects-text" class="projects-text"></div>
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
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

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
       if (this.open && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.hide(); // directly hide popup and unlock player
    }
  }
}
