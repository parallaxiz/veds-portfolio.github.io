export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
    // Load background and player sprite
        this.load.image("background", "/assets/background.png"); 
        this.load.spritesheet("player", "/assets/16x32 Walk Cycle-Sheet.png", {
            frameWidth: 16,
            frameHeight: 32
        });
    //Load Objects
        this.load.json("roomShape", "/assets/roomShape.json");
        this.load.image("bed","/assets/bed.png");
        this.load.image("bed_s","/assets/bed_s.png");
        this.load.image("cabinet","/assets/cabinet.png");
        this.load.image("cabinet_s","/assets/cabinet_s.png");
        this.load.image("laptop","/assets/laptop.png");
        this.load.image("laptop_s","/assets/laptop_s.png");
        this.load.image("bookshelf","/assets/bookshelf.png");
        this.load.image("bookshelf_s","/assets/bookshelf_s.png");
    //Load Text
        this.load.image("about_me","/assets/about_me.png")
        this.load.image("projects","/assets/projects.png")
        this.load.image("contact_info","/assets/contact_info.png")
        this.load.image("skills","/assets/skills.png")   
        this.load.image("startBtn", "/assets/startBtn.png");
        this.load.image("startBtnHover", "/assets/startBtnHover.png");
        this.load.image("ved_portfolio", "/assets/ved_portfolio.png");
    //font
    this.load.font("edit-undo", "/assets/edit-undo.ttf"); // custom font
     
    // Loading bar background
        const { width, height } = this.scale;
        const bgBar = this.add.rectangle(width/2, height/2, 400, 40, 0x222222);
        const progressBar = this.add.rectangle(width/2 - 200, height/2, 0, 40, 0xffffff);
        this.load.on("progress", (value) => {
            progressBar.width = 400 * value;
        });
    // Load ALL assets here instead of MainScene
        this.load.image("background", "/assets/background.png");
        this.load.spritesheet("player", "/assets/16x32 Walk Cycle-Sheet.png", {
            frameWidth: 16,
            frameHeight: 32
         });
    // Background
        this.load.image("bg", "assets/background.png");
    // Player sprite sheet (each frame is 16x32)
        this.load.spritesheet("player", "assets/16x32 Walk Cycle-Sheet.png", {
            frameWidth: 16,
            frameHeight: 32
        });
    // Debug logging
        this.load.on("filecomplete", (key) => {
            console.log(`Loaded: ${key}`);
        });
        this.load.on("loaderror", (file) => {
            console.error(`Failed to load: ${file.key}`);
        });
    }

    create() {
        this.scene.start("MainScene");

    }
}
