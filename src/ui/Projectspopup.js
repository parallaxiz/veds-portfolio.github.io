export default class ProjectsPopup {
  constructor(scene) {
    this.scene = scene;
    this.open = false;

    // Create HTML popup container
    this.container = document.createElement("div");
    this.container.classList.add("projects-popup");

    // Add background image
    this.container.style.backgroundImage = `url('assets/projects_bg.png')`;

    // Add close button
    this.closeBtn = document.createElement("button");
    this.closeBtn.innerText = "X";
    this.closeBtn.classList.add("popup-close");
    this.container.appendChild(this.closeBtn);

    // Add content area
    this.content = document.createElement("div");
    this.content.classList.add("popup-content");
    this.content.innerHTML = `
      <h2>My Projects</h2>
      <p>Here you can showcase your portfolio projects.</p>
    `;
    this.container.appendChild(this.content);

    // Append to body but keep hidden
    document.body.appendChild(this.container);
    this.hide();

    // Close button event
    this.closeBtn.addEventListener("click", () => this.hide());
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
