export default class SkillsPopup {
  constructor(scene) {
    this.scene = scene;
    this.open = false;

    // Create popup container if it doesn't exist
    this.container = document.getElementById("skills-popup");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "skills-popup";
      this.container.className = "popup hidden";
      this.container.innerHTML = `
        <div class="popup-content">
          <img src="assets/skills_bg.png" class="popup-bg" alt="Popup Background" />
          <h1>My Skills</h1>
          
          <!-- Page 1 -->
          <div class="page-1" id="skills-page-1">
           <div class="skill-text">
            okayokaydsaadasfnakxnkasdlnclaihdlcknaoiislckakbsclcjbakdnxc adnc,ja  dukbfnoasiduboandkfbaoidnfonclcjbakdnxc adnc,ja  dukbfnoasiduboandkfbaoidnfonclcjbakdnxc adnc,ja  dukbfnoasiduboandkfbaoidnfonclcjbakdnxc adnc,ja  dukbfnoasiduboandkfbaoidnfon
           </div>
           <div class="skill-text-1">
            okayokaydsaadasfnakxnkasdlnclaihdlcknaoiislckakbsclcjbakdnxc adnc,ja  <br>dukbfnoasiduboandkfbaoidnfon
           </div>
          </div>

          <!-- Page 2 -->
          <div class="page-2 hidden" id="skills-page-2">
          <div class="skill-text-2">
            okayokaydsaadasfnakxnkasdlnclaihdlcknaoiislckakbsclcjbakdnxc adnc,ja  <br>dukbfnoasiduboandkfbaoidnfon
           </div>
           <div class="skill-text-3">
            okayokaydsaadasfnakxnkasdlnclaihdlcknaoiislckakbsclcjbakdnxc adnc,ja  <br>dukbfnoasiduboandkfbaoidnfon
           </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="popup-nav">
            <button id="skills-prev-page" class="hidden">← Back</button>
            <button id="skills-next-page">Next →</button>
          </div>

          <button id="close-skills-popup" class="close-btn">X</button>
        </div>
      `;
      document.body.appendChild(this.container);
    }

    // Cache buttons
    this.closeBtn = this.container.querySelector("#close-skills-popup");
    this.nextBtn = this.container.querySelector("#skills-next-page");
    this.prevBtn = this.container.querySelector("#skills-prev-page");

    // Cache pages
    this.page1 = this.container.querySelector("#skills-page-1");
    this.page2 = this.container.querySelector("#skills-page-2");

    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
    }

    // Next button → show page 2
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.page1.classList.add("hidden");
        this.page2.classList.remove("hidden");
        this.nextBtn.classList.add("hidden");
        this.prevBtn.classList.remove("hidden");
      });
    }

    // Back button → show page 1
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.page2.classList.add("hidden");
        this.page1.classList.remove("hidden");
        this.prevBtn.classList.add("hidden");
        this.nextBtn.classList.remove("hidden");
      });
    }

    // Click outside content to close
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.hide();
    });

    // E key via Phaser input
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  // Update method — called in scene.update()
  update() {
    if (this.open && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.hide();
    }
  }

  show() {
    if (this.open) return;
    this.open = true;
    this.container.classList.remove("hidden");
    this.scene.contactMenuOpen = true;

    // Reset to page 1 whenever popup opens
    this.page1.classList.remove("hidden");
    this.page2.classList.add("hidden");
    this.nextBtn.classList.remove("hidden");
    this.prevBtn.classList.add("hidden");
  }

  hide() {
    if (!this.open) return;
    this.open = false;
    this.container.classList.add("hidden");
    this.scene.contactMenuOpen = false;
  }
}
