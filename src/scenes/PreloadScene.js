export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        // ✅ Works locally & on GitHub Pages
        const basePath = import.meta.env.BASE_URL + "assets/";

        // Background & player sprite
        this.load.image("background", basePath + "background.png");
        this.load.spritesheet("player", basePath + "16x32_Walk_Cycle-Sheet.png", {
            frameWidth: 16,
            frameHeight: 32,
        });

        // Room & objects
        this.load.json("roomShape", basePath + "roomShape.json");
        this.load.image("bed", basePath + "bed.png");
        this.load.image("bed_s", basePath + "bed_s.png");
        this.load.image("cabinet", basePath + "cabinet.png");
        this.load.image("cabinet_s", basePath + "cabinet_s.png");
        this.load.image("laptop", basePath + "laptop.png");
        this.load.image("laptop_s", basePath + "laptop_s.png");
        this.load.image("bookshelf", basePath + "bookshelf.png");
        this.load.image("bookshelf_s", basePath + "bookshelf_s.png");

        //rules
        this.load.image("rules", basePath + "rules.png")

        // Text popups
        this.load.image("about_me", basePath + "about_me.png");
        this.load.image("projects", basePath + "projects.png");
        this.load.image("contact_info", basePath + "contact_info.png");
        this.load.image("skills", basePath + "skills.png");
        this.load.image("ved_portfolio", basePath + "ved_portfolio.png");

        // Buttons
        this.load.image("startBtn", basePath + "startBtn.png");
        this.load.image("startBtnHover", basePath + "startBtnHover.png");

        // Font
        this.load.font("edit-undo", basePath + "edit-undo.ttf");

        // ✅ Loading bar
        const { width, height } = this.scale;
        const bgBar = this.add.rectangle(width / 2, height / 2, 400, 40, 0x222222);
        const progressBar = this.add.rectangle(width / 2 - 200, height / 2, 0, 40, 0xffffff);

        this.load.on("progress", (value) => {
            progressBar.width = 400 * value;
        });

        // Debug logs
        this.load.on("filecomplete", (key) => console.log(`✅ Loaded: ${key}`));
        this.load.on("loaderror", (file) => console.error(`❌ Failed to load: ${file.key}`));
    }

    create() {
        // Wait until all assets are ready
        this.scene.start("MainScene");
    }
}
