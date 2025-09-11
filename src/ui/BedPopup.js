export default class BedPopup {
  constructor(scene) {
    this.scene = scene;
    this.open = false;

    // Create popup container if it doesn't exist
    this.container = document.getElementById("bed-popup");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "bed-popup";
      this.container.className = "popup hidden";
      this.container.innerHTML = `
        <div class="popup-content">
          <img src="assets/about_me_bg.png" class="popup-bg" alt="Popup Background" />
          <h1>About Me</h1>
          
          <!-- Page 1 -->
          <div class="page-1" id="page-1">
            <div id="bed-text">
              Hi, my name is Ved, and I am currently pursuing my degree at Vishwakarma Institute of Technology, 
              with an expected graduation year of 2028. I've never considered myself great at reading or memorizing 
              things, but I’ve always had a natural ability to pick up new concepts quickly and adapt them to 
              suit my needs, interests, and ideas. Throughout my life, I’ve noticed that whenever something 
              truly aligns with my 
              <br>
              <b>1</b>
            
              </div>
            <div id="bed-text-1">
              ideals or sparks my curiosity, I’m able to invest myself into it wholeheartedly. I enjoy exploring, 
              experimenting, and learning by doing and that approach has shaped the way I grow. This is where my 
              passion for art and coding comes into play. I’ve always had a keen eye for detail and a deep love 
              for sketching and drawing. Over time, this passion naturally evolved into digital art and UI/UX 
            </div>
          </div>

          <!-- Page 2 -->
          <div class="page-2" id="page-2">
        
            <div id="bed-text-2">
            test
            design, which has not only allowed me to express myself creatively but has also proven to be a 
            valuable skill in my college work and personal projects. At the same time, my interest in coding 
            opened up a whole new world for me. I see coding as more than just writing lines of instructions for
             me, it’s an outlet for creativity, a way to translate my thoughts and ideas into reality. Whenever I 
             come up with an 
             <br>
             <b>2</b>
            </div>
            <div id="bed-text-3">
            idea, I know I can bring it to life through code, shaping it exactly as I envision it. This freedom
            to create without boundaries is what makes coding so exciting and fulfilling to me. And when I 
            finally decided to merge my love for art and coding, it felt like the perfect harmony of my passions.
            That combination gave birth to this project a reflection of my creativity, my skills, and my journey so far.
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="popup-nav">
            <button id="prev-page" class="hidden">← Back</button>
            <button id="next-page">Next →</button>
          </div>

          <button id="close-bed-popup" class="close-btn">X</button>
        </div>
      `;
      document.body.appendChild(this.container);
    }
    // Cache buttons
    this.closeBtn = this.container.querySelector("#close-bed-popup");
    this.nextBtn = this.container.querySelector("#next-page");
    this.prevBtn = this.container.querySelector("#prev-page");

    // Cache pages
    this.page1 = this.container.querySelector("#page-1");
    this.page2 = this.container.querySelector("#page-2");

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
