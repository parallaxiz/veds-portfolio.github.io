// src/ui/ContactPopup.js
export default class ContactPopup {
  constructor(scene) {
    this.scene = scene;
    this.open = false;

    // Check if popup already exists; otherwise create it
    this.container = document.getElementById("contact-popup");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "contact-popup";
      this.container.className = "popup hidden";
      this.container.innerHTML = `
        <div class="popup-content">
          <img src="assets/contact_popup_bg.png" class="popup-bg" alt="Popup Background" />
          <h1>Contact Info</h1>
          
          <div class="popup-link" id="email-link">📧 ved.m136@gmail.com</div>
          <div class="popup-link" id="phone-link">📱 +91 98765 43210</div>
          <div class="popup-link" id="linkedin-link">🔗 LinkedIn Profile</div>
          
          <button id="close-contact-popup" class="close-btn">X</button>
        </div>
      `;
      document.body.appendChild(this.container);
    }

    // Cache elements
    this.emailLink = this.container.querySelector("#email-link");
    this.phoneLink = this.container.querySelector("#phone-link");
    this.linkedinLink = this.container.querySelector("#linkedin-link");
    this.closeBtn = this.container.querySelector("#close-contact-popup");

    // Email → Copy to clipboard
    if (this.emailLink) {
      this.emailLink.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("ved.m136@gmail.com");
          this.emailLink.textContent = "📧 Copied!";
          setTimeout(() => {
            this.emailLink.textContent = "📧 ved.m136@gmail.com";
          }, 1000);
        } catch (err) {
          console.error("Failed to copy email:", err);
        }
      });
    }

    // Phone → Copy to clipboard
    if (this.phoneLink) {
      this.phoneLink.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("+91 6361320426");
          this.phoneLink.textContent = "📱 Copied!";
          setTimeout(() => {
            this.phoneLink.textContent = "📱 +91 6361320426";
          }, 1000);
        } catch (err) {
          console.error("Failed to copy phone:", err);
        }
      });
    }

    // LinkedIn → Open in new tab
    if (this.linkedinLink) {
      this.linkedinLink.addEventListener("click", () => {
        window.open("https://www.linkedin.com/in/ved-madurwar-34265a332?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", "_blank");
      });
    }

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
    }

    // Click outside popup content to close
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.hide();
    });

    // Phaser E key
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  // Call this in your scene's update loop
  update() {
    if (this.open && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.hide(); // directly hide popup and unlock player
    }
  }

  show() {
    if (this.open) return;
    this.open = true;
    this.container.classList.remove("hidden");
    this.scene.contactMenuOpen = true; // lock player
  }

  hide() {
    if (!this.open) return;
    this.open = false;
    this.container.classList.add("hidden");
    this.scene.contactMenuOpen = false; // unlock player
  }
}
