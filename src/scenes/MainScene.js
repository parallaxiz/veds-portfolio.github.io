import ContactPopup from "../ui/ContactPopup.js";
import BedPopup from "../ui/BedPopup.js";
import ProjectsPopup from "../ui/ProjectsPopup.js"; 
import SkillsPopup from "../ui/SkillsPopup.js"; 
import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        const { width, height } = this.scale;

        // -------------------------------
        // START SCREEN
        // -------------------------------
        this.inputLocked = true; // 🔒 lock movement initially
        this.textures.get("startBtn").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("startBtnHover").setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);

        this.textures.get("ved_portfolio").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.title = this.add.image(width / 2, height / 2 - 100, "ved_portfolio")
            .setOrigin(0.5)
            .setDepth(101)
            .setScale(10);
        this.textures.get("rules").setFilter(Phaser.Textures.FilterMode.NEAREST);
        // Add top-left "Rules" button
        this.textures.get("rules").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.rulesButton = this.add.text(20, 20, "Rules", {
            fontFamily: "edit-undo",
            fontSize: "48px",
            color: "#ffffff",
            backgroundColor: "#3e3b66",
            padding: { x: 15, y: 10 }
        })
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true })
            .setDepth(102)
            .setVisible(false); // Initially hidden
        
        // Create hidden overlay for rules popup
        this.rulesOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
            .setDepth(200)
            .setVisible(false);
        
        this.rulesPopup = this.add.image(width / 2, height / 2, "rules")
            .setOrigin(0.5)
            .setDepth(201)
            .setScale(8)
            .setVisible(false);
        
        this.closeButton = this.add.text(width - 80, 40, "X", {
            fontFamily: "edit-undo",
            fontSize: "60px",
            color: "#ffffff",
            backgroundColor: "#f03a3a",
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(202)
            .setVisible(false);
        
        // Show rules popup when button clicked
        this.rulesButton.on("pointerdown", () => {
            this.rulesOverlay.setVisible(true);
            this.rulesPopup.setVisible(true);
            this.closeButton.setVisible(true);
        });
        
        this.closeButton.on("pointerdown", () => {
            this.rulesOverlay.setVisible(false);
            this.rulesPopup.setVisible(false);
            this.closeButton.setVisible(false);
        });

        // Add back button (initially hidden)
        this.backButton = this.add.text(width - 100, 20, "Back", {
            fontFamily: "edit-undo",
            fontSize: "48px",
            color: "#ffffff",
            backgroundColor: "#3e3b66",
            padding: { x: 15, y: 10 }
        })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .setDepth(102)
            .setVisible(false);

        this.backButton.on("pointerdown", () => {
            // Make elements visible before fading in
            this.overlay.setVisible(true);
            this.title.setVisible(true);
            this.buttonsGroup.setVisible(true);
            // Re-enable button interactivity
            this.peopleButton.getAt(0).setInteractive(); // The background rectangle
            this.recruitersButton.getAt(0).setInteractive();
            // Fade in start screen
            this.tweens.add({
                targets: [this.overlay, this.title, this.buttonsGroup],
                alpha: 1,
                duration: 600,
                ease: 'Power2',
                onComplete: () => {
                    this.inputLocked = true;
                    this.backButton.setVisible(false);
                    this.rulesButton.setVisible(false);
                }
            });
        });

        // Title breathing animation
        this.tweens.add({
            targets: this.title,
            scale: 9,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

            // --- Centered, larger, square buttons with icons ---
            const buttonWidth = 340;
            const buttonHeight = 140; // Made taller for more square look
            const buttonFontSize = '44px';
            const buttonPadding = { x: 30, y: 24 };
            const buttonSpacing = 40;

            // Recruiters button
            const recruitersBg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x3e3b66, 1)
                .setOrigin(0.5)
                .setStrokeStyle(6, 0xffffff);
            const recruitersIcon = this.add.text(0, -buttonHeight * 0.18, '💼', {
                fontSize: '48px',
                fontFamily: 'edit-undo',
                color: '#fff',
                align: 'center',
            }).setOrigin(0.5);
            const recruitersText = this.add.text(0, buttonHeight * 0.18, 'RECRUITERS', {
                fontFamily: 'edit-undo',
                fontSize: buttonFontSize,
                color: '#ffffff',
                align: 'center',
            }).setOrigin(0.5);
            this.recruitersButton = this.add.container(0, 0, [recruitersBg, recruitersIcon, recruitersText]);
            this.recruitersButton.setSize(buttonWidth, buttonHeight);
            recruitersBg.setInteractive()
                .on('pointerover', () => recruitersBg.setFillStyle(0x5e5b96))
                .on('pointerout', () => recruitersBg.setFillStyle(0x3e3b66))
                .on('pointerdown', () => {
                    window.location.href = 'recruiters.html';
                });

            // People Just Looking Around button
            const peopleBg = this.add.rectangle(0, 0, buttonWidth + 80, buttonHeight, 0x3e3b66, 1)
                .setOrigin(0.5)
                .setStrokeStyle(6, 0xffffff);
            const peopleIcon = this.add.text(0, -buttonHeight * 0.18, '👀', {
                fontSize: '48px',
                fontFamily: 'edit-undo',
                color: '#fff',
                align: 'center',
            }).setOrigin(0.5);
            const peopleText = this.add.text(0, buttonHeight * 0.18, 'PEOPLE JUST\nLOOKING AROUND', {
                fontFamily: 'edit-undo',
                fontSize: buttonFontSize,
                color: '#ffffff',
                align: 'center',
            }).setOrigin(0.5);
            this.peopleButton = this.add.container(0, 0, [peopleBg, peopleIcon, peopleText]);
            this.peopleButton.setSize(buttonWidth + 80, buttonHeight);
            peopleBg.setInteractive()
                .on('pointerover', () => peopleBg.setFillStyle(0x5e5b96))
                .on('pointerout', () => peopleBg.setFillStyle(0x3e3b66))
                .on('pointerdown', () => {
                    this.peopleButton.disableInteractive();
                    this.recruitersButton.disableInteractive();
                    this.tweens.add({
                        targets: [this.overlay, this.title, this.buttonsGroup],
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => {
                            this.overlay.setVisible(false);
                            this.title.setVisible(false);
                            this.buttonsGroup.setVisible(false);
                            this.inputLocked = false;
                            this.backButton.setVisible(true);
                            this.rulesButton.setVisible(true);
                        }
                    });
                });

            // Center the buttons as a group
            const totalButtonWidth = buttonWidth + 80 + buttonSpacing;
            this.recruitersButton.x = -((buttonWidth + 80) / 2 + buttonSpacing / 2);
            this.peopleButton.x = ((buttonWidth + 80) / 2 + buttonSpacing / 2);
            this.recruitersButton.y = 0;
            this.peopleButton.y = 0;
            // Add both buttons to a container
            this.buttonsGroup = this.add.container(width / 2, height / 2 + 120, [this.recruitersButton, this.peopleButton]);
            this.buttonsGroup.setDepth(101);

        // -------------------------------
        // BACKGROUND + COLLIDER
        // -------------------------------
        const ROOM_OFFSET_X = 0;
        const ROOM_OFFSET_Y = -30;

        this.bg = this.add.image(width / 2, height / 2, "background").setOrigin(0.5);
        const scaleX = width / this.bg.width;
        const scaleY = height / this.bg.height;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);
        this.bg.setScrollFactor(0);
        this.bg.setPipeline("TextureTintPipeline");
        this.textures.get("background").setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Store initial scale for resizing
        this.initialScale = scale;

        const shapes = this.cache.json.get("roomShape");
        this.roomCollider = this.matter.add.sprite(width / 2, height / 2, "background", null, {
            shape: shapes["background"],
            isStatic: true
        });
        this.roomCollider.setBody(shapes.background);
        this.roomCollider.setStatic(true).setVisible(false);

        const colliderScaleX = width / this.roomCollider.width;
        const colliderScaleY = height / this.roomCollider.height;
        this.roomCollider.setScale(colliderScaleX, colliderScaleY);
        this.roomCollider.setPosition(width / 2 + ROOM_OFFSET_X, height / 2 + ROOM_OFFSET_Y);

        // -------------------------------
        // PLAYER
        // -------------------------------
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.player = this.matter.add.sprite(centerX - 50, centerY + 180, "player", 0);
        this.player.setDepth(2).setScale(7);
        this.textures.get("player").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.player.setOrigin(0.5).setBody({
            type: "rectangle",
            width: this.player.width * 4,
            height: this.player.height * 4.3
        });
        this.player.setFixedRotation();

        // Store original positions for resizing
        this.player.originalX = 910;
        this.player.originalY = 780;
        this.player.offsetX = 0;
        this.player.offsetY = 0;

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            interactKey: Phaser.Input.Keyboard.KeyCodes.E
        });

        // -------------------------------
        // PLAYER ANIMATIONS
        // -------------------------------
        const anims = [
            { key: "walk-down", start: 0, end: 3 },
            { key: "walk-down-left", start: 4, end: 7 },
            { key: "walk-left", start: 8, end: 11 },
            { key: "walk-up-left", start: 12, end: 15 },
            { key: "walk-up", start: 16, end: 19 },
            { key: "walk-down-right", start: 20, end: 23 },
            { key: "walk-right", start: 24, end: 27 },
            { key: "walk-up-right", start: 28, end: 31 }
        ];
        anims.forEach(({ key, start, end }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers("player", { start, end }),
                frameRate: 8,
                repeat: -1
            });
        });

        // -------------------------------
        // POPUPS
        // -------------------------------
        this.contactPopup = new ContactPopup(this);
        this.bedPopup = new BedPopup(this);
        this.projectsPopup = new ProjectsPopup(this); 
        this.skillsPopup = new SkillsPopup(this); // ✅ Added


        // -------------------------------
        // OBJECTS
        // -------------------------------
//const createObject = (name, x, y, offsetX, offsetY) => {
//    const obj = this.add.sprite(x, y, name).setOrigin(0.5).setScale(scale);
//    obj.setPosition(obj.x + offsetX, obj.y + offsetY);
//    this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
//    return obj;
//}
//
//// Bed + About Me
//const bed = createObject("bed", 600, 400, 66, -28);
//const bed_s = createObject("bed_s", 600, 400, 66, -28);
//const about_me = createObject("about_me", 600, 400, 63, -221);
//bed_s.setVisible(false);
//about_me.setVisible(false);
//this.objects_b = { bed, bed_s, about_me };
//bed_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.bedPopup.show())
//
//// Cabinet + Contact Info
//const cabinet = createObject("cabinet", 600, 400, 286, 29);
//const cabinet_s = createObject("cabinet_s", 600, 400, 286, 29);
//const contact_info = createObject("contact_info", 600, 400, 267, -103);
//cabinet_s.setVisible(false);
//contact_info.setVisible(false);
//this.objects_c = { cabinet, cabinet_s, contact_info };
//cabinet_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.contactPopup.show())
//
//// Laptop + Projects
//const laptop = createObject("laptop", 600, 400, -172, 61).setDepth(3);
//const laptop_s = createObject("laptop_s", 600, 400, -172, 61).setDepth(3);
//const projects = createObject("projects", 600, 400, -166, -47);
//laptop_s.setVisible(false);
//projects.setVisible(false);
//this.objects_l = { laptop, laptop_s, projects };
//laptop_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.projectsPopup.show());
//
//// Bookshelf + Skills
//const bookshelf = createObject("bookshelf", 600, 400, 514, -75);
//const bookshelf_s = createObject("bookshelf_s", 600, 400, 514, -75);
//const skills = createObject("skills", 600, 400, 329, -155);
//bookshelf_s.setVisible(false);
//skills.setVisible(false);
//this.objects_bs = { bookshelf, bookshelf_s, skills };

const createObject = (name, originalX, originalY, offsetX, offsetY, depth = 1) => {
    // Get the current display size of the scaled game
    const displayWidth = this.scale.width;
    const displayHeight = this.scale.height;

    // Get the original game dimensions for ratio calculation
    const originalScreenWidth = 1920;
    const originalScreenHeight = 1200;

    // Calculate new x and y based on the ratio of original screen dimensions
    // and the current display size
    const newX = (originalX / originalScreenWidth) * displayWidth;
    const newY = (originalY / originalScreenHeight) * displayHeight;
    
    // Create the sprite with the new relative position
    const obj = this.add.sprite(newX, newY, name).setOrigin(0.5).setScale(scale).setDepth(depth);
    obj.setPosition(obj.x + offsetX, obj.y + offsetY);
    this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
    // Store original positions for resizing
    obj.originalX = originalX;
    obj.originalY = originalY;
    obj.offsetX = offsetX;
    obj.offsetY = offsetY;
    return obj;
}

// All object creation calls remain the same as the function now handles the scaling
const bed = createObject("bed", 600, 400, 66+140, -28+147);
const bed_s = createObject("bed_s", 600, 400, 66+133, -28+147, 2);
const about_me = createObject("about_me", 600, 400, 63+120, -221+135);
bed_s.setVisible(false);
about_me.setVisible(false);
this.objects_b = { bed, bed_s, about_me };
bed_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.bedPopup.show())

const cabinet = createObject("cabinet", 600, 400, 286+165, 29+156);
const cabinet_s = createObject("cabinet_s", 600, 400, 286+165, 29+156, 2);
const contact_info = createObject("contact_info", 600, 400, 267+120, -103+135);
cabinet_s.setVisible(false);
contact_info.setVisible(false);
this.objects_c = { cabinet, cabinet_s, contact_info };
cabinet_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.contactPopup.show())

const laptop = createObject("laptop", 600, 400, -172+114, 61+157, 2);
const laptop_s = createObject("laptop_s", 600, 400, -172+114, 61+157, 2);
const projects = createObject("projects", 600, 400, -166+120, -47+135);
laptop_s.setVisible(false);
projects.setVisible(false);
this.objects_l = { laptop, laptop_s, projects };
laptop_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.projectsPopup.show());

const bookshelf = createObject("bookshelf", 600, 400, 514+191, -75+143);
const bookshelf_s = createObject("bookshelf_s", 600, 400, 514+191, -75+143, 2);
const skills = createObject("skills", 600, 400, 329+170, -155+135);
bookshelf_s.setVisible(false);
skills.setVisible(false);
this.objects_bs = { bookshelf, bookshelf_s, skills }

// Store all objects for resizing
this.allObjects = [
    bed, bed_s, about_me,
    cabinet, cabinet_s, contact_info,
    laptop, laptop_s, projects,
    bookshelf, bookshelf_s, skills
];

// Add resize event listener
this.scale.on('resize', this.resize, this);
 }

    update() {
        this.bedPopup.update();
        this.contactPopup.update();
        this.projectsPopup.update(); // ✅ Added
        this.skillsPopup.update(); // ✅ Added


        // Stop player when popup is open
       if (this.contactPopup.open || this.bedPopup.open || this.projectsPopup.open || this.skillsPopup.open) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
        }
        

        // -------------------------------
        // PLAYER MOVEMENT + DEPTH
        // -------------------------------
        if (this.inputLocked) return;
        this.player.setDepth(this.player.y / 140);

        const speed = 10;
        const { up, down, left, right } = this.keys;
        const player = this.player;

        player.setVelocity(0);
        if (up.isDown && left.isDown) {
            player.setVelocity(-speed * 0.7, -speed * 0.7);
            player.anims.play("walk-up-left", true);
        } else if (up.isDown && right.isDown) {
            player.setVelocity(speed * 0.7, -speed * 0.7);
            player.anims.play("walk-up-right", true);
        } else if (down.isDown && left.isDown) {
            player.setVelocity(-speed * 0.7, speed * 0.7);
            player.anims.play("walk-down-left", true);
        } else if (down.isDown && right.isDown) {
            player.setVelocity(speed * 0.7, speed * 0.7);
            player.anims.play("walk-down-right", true);
        } else if (up.isDown) {
            player.setVelocityY(-speed);
            player.anims.play("walk-up", true);
        } else if (down.isDown) {
            player.setVelocityY(speed);
            player.anims.play("walk-down", true);
        } else if (left.isDown) {
            player.setVelocityX(-speed);
            player.anims.play("walk-left", true);
        } else if (right.isDown) {
            player.setVelocityX(speed);
            player.anims.play("walk-right", true);
        } else {
            player.anims.stop();
        }

        // -------------------------------
        // OBJECT HIGHLIGHT + INTERACTION
        // -------------------------------
        let activeObject = null;
        let minDistance = Infinity;
        const objectGroups = [
            { key: "bed", normal: this.objects_b.bed, selected: [this.objects_b.bed_s, this.objects_b.about_me] },
            { key: "cabinet", normal: this.objects_c.cabinet, selected: [this.objects_c.cabinet_s, this.objects_c.contact_info] },
            { key: "laptop", normal: this.objects_l.laptop, selected: [this.objects_l.laptop_s, this.objects_l.projects] },
            { key: "bookshelf", normal: this.objects_bs.bookshelf, selected: [this.objects_bs.bookshelf_s, this.objects_bs.skills] }
        ];

        objectGroups.forEach(({ key, normal, selected }) => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, normal.x, normal.y);
            if (distance < 120 && distance < minDistance) {
                minDistance = distance;
                activeObject = key;
            }
        });

        objectGroups.forEach(({ key, normal, selected }) => {
            if (key === activeObject) {
                normal.setVisible(false);
                selected.forEach(obj => obj.setVisible(true));
            } else {
                normal.setVisible(true);
                selected.forEach(obj => obj.setVisible(false));
            }
        });

        // -------------------------------
        // INTERACT VIA "E" KEY
        // -------------------------------
        if (Phaser.Input.Keyboard.JustDown(this.keys.interactKey)) {

            // Close existing popups
            if (this.contactPopup.open) this.contactPopup.triggerClose();
            if (this.bedPopup.open) this.bedPopup.triggerClose();
            if (this.projectsPopup.open) this.projectsPopup.triggerClose();
            if (this.skillsPopup.open) this.skillsPopup.triggerClose(); // ✅ Added
                    
            // Open popup for highlighted object
            if (this.objects_c.cabinet_s.visible) {
                this.contactPopup.show();
            } else if (this.objects_b.bed_s.visible) {
                this.bedPopup.show();
            } else if (this.objects_l.laptop_s.visible) {
                this.projectsPopup.show();
            } else if (this.objects_bs.bookshelf_s.visible) {
                this.skillsPopup.show(); // ✅ Added
            }  
        }
    }

    resize(gameSize) {
        const { width, height } = gameSize;

        // Reposition and rescale background
        const bgSourceWidth = this.textures.get("background").getSourceImage().width;
        const bgSourceHeight = this.textures.get("background").getSourceImage().height;
        const scaleX = width / bgSourceWidth;
        const scaleY = height / bgSourceHeight;
        const bgScale = Math.max(scaleX, scaleY);
        this.bg.setScale(bgScale);
        this.bg.setPosition(width / 2, height / 2);

        // Reposition and rescale room collider
        const colliderSourceWidth = this.roomCollider.width / this.roomCollider.scaleX; // assuming original scale is 1
        const colliderSourceHeight = this.roomCollider.height / this.roomCollider.scaleY;
        const colliderScaleX = width / colliderSourceWidth;
        const colliderScaleY = height / colliderSourceHeight;
        this.roomCollider.setScale(colliderScaleX, colliderScaleY);
        this.roomCollider.setPosition(width / 2 + ROOM_OFFSET_X, height / 2 + ROOM_OFFSET_Y);

        // Reposition start screen elements if they exist
        if (this.overlay) {
            this.overlay.setPosition(width / 2, height / 2);
            this.overlay.setSize(width, height);
        }
        if (this.title) {
            this.title.setPosition(width / 2, height / 2 - 100);
        }
        if (this.recruitersButton) {
            this.recruitersButton.setPosition(width / 2 - 200, height / 2 + 100);
        }
        if (this.peopleButton) {
            
            this.peopleButton.setPosition(width / 2 + 200, height / 2 + 100);
        }
        if (this.rulesButton) {
            this.rulesButton.setPosition(20, 20);
        }
        if (this.buttonsGroup) {
            this.buttonsGroup.setPosition(width / 2, height / 2 + 120);
        }
        if (this.backButton) {
            this.backButton.setPosition(width - 100, 20);
        }
        if (this.rulesOverlay) {
            this.rulesOverlay.setPosition(width / 2, height / 2);
            this.rulesOverlay.setSize(width, height);
        }
        if (this.rulesPopup) {
            this.rulesPopup.setPosition(width / 2, height / 2);
        }
        if (this.closeButton) {
            this.closeButton.setPosition(width - 80, 40);
        }

        // Reposition player
        const playerNewX = (this.player.originalX / 1920) * width + this.player.offsetX;
        const playerNewY = (this.player.originalY / 1200) * height + this.player.offsetY;
        this.player.setPosition(playerNewX, playerNewY);
        this.player.setScale(7 * (bgScale / this.initialScale));
        // Update physics body to match new scale
        this.player.setBody({
            type: "rectangle",
            width: this.player.width * 4,
            height: this.player.height * 4.3
        });

        // Reposition and rescale all objects
        const originalScreenWidth = 1920;
        const originalScreenHeight = 1200;
        this.allObjects.forEach(obj => {
            const newX = (obj.originalX / originalScreenWidth) * width;
            const newY = (obj.originalY / originalScreenHeight) * height;
            obj.setPosition(newX + obj.offsetX, newY + obj.offsetY);
            obj.setScale(bgScale);
        });

        // Also reposition popups if needed, but they might handle their own positioning
    }
}
