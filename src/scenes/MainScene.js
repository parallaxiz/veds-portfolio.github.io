import ContactPopup from "C:/Users/vedm1/ved_project/src/ui/ContactPopup.js";
import BedPopup from "C:/Users/vedm1/ved_project/src/ui/BedPopup.js";
import ProjectPopup from "C:/Users/vedm1/ved_project/src/ui/ProjectsPopup.js"; 
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
        this.textures.get("startBtn").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("startBtnHover").setFilter(Phaser.Textures.FilterMode.NEAREST);

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);

        this.textures.get("ved_portfolio").setFilter(Phaser.Textures.FilterMode.NEAREST);
        const title = this.add.image(width / 2, height / 2 - 100, "ved_portfolio")
            .setOrigin(0.5)
            .setDepth(101)
            .setScale(10);

        // Title breathing animation
        this.tweens.add({
            targets: title,
            scale: 9,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        const startButton = this.add.image(width / 2, height / 2 + 100, "startBtn")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(101)
            .setScale(10);

        startButton.on("pointerover", () => startButton.setTexture("startBtnHover"));
        startButton.on("pointerout", () => startButton.setTexture("startBtn"));
        startButton.on("pointerdown", () => {
            startButton.disableInteractive();
            this.tweens.add({
                targets: [overlay, title, startButton],
                alpha: 0,
                duration: 600,
                ease: "Power2",
                onComplete: () => {
                    overlay.destroy();
                    title.destroy();
                    startButton.destroy();
                }
            });
        });

        // -------------------------------
        // BACKGROUND + COLLIDER
        // -------------------------------
        const ROOM_OFFSET_X = 0;
        const ROOM_OFFSET_Y = -30;

        const bg = this.add.image(width / 2, height / 2, "background").setOrigin(0.5);
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        bg.setScrollFactor(0);
        bg.setPipeline("TextureTintPipeline");
        this.textures.get("background").setFilter(Phaser.Textures.FilterMode.NEAREST);

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
        this.projectsPopup = new ProjectsPopup(this); // ✅ Added

        // -------------------------------
        // OBJECTS
        // -------------------------------
        const createObject = (name, x, y, offsetX, offsetY) => {
            const obj = this.add.sprite(x, y, name).setOrigin(0.5).setScale(scale);
            obj.setPosition(obj.x + offsetX, obj.y + offsetY);
            this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
            return obj;
        };

        // Bed + About Me
        const bed = createObject("bed", 600, 400, 66, -28);
        const bed_s = createObject("bed_s", 600, 400, 66, -28);
        const about_me = createObject("about_me", 600, 400, 63, -221);
        bed_s.setVisible(false);
        about_me.setVisible(false);
        this.objects_b = { bed, bed_s, about_me };
        bed_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.bedPopup.show());

        // Cabinet + Contact Info
        const cabinet = createObject("cabinet", 600, 400, 286, 29);
        const cabinet_s = createObject("cabinet_s", 600, 400, 286, 29);
        const contact_info = createObject("contact_info", 600, 400, 267, -103);
        cabinet_s.setVisible(false);
        contact_info.setVisible(false);
        this.objects_c = { cabinet, cabinet_s, contact_info };
        cabinet_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.contactPopup.show());

        // Laptop + Projects
        const laptop = createObject("laptop", 600, 400, -172, 61).setDepth(3);
        const laptop_s = createObject("laptop_s", 600, 400, -172, 61).setDepth(3);
        const projects = createObject("projects", 600, 400, -166, -47);
        laptop_s.setVisible(false);
        projects.setVisible(false);
        this.objects_l = { laptop, laptop_s, projects };
        laptop_s.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.projectsPopup.show()); // ✅ Added

        // Bookshelf + Skills
        const bookshelf = createObject("bookshelf", 600, 400, 514, -75);
        const bookshelf_s = createObject("bookshelf_s", 600, 400, 514, -75);
        const skills = createObject("skills", 600, 400, 329, -155);
        bookshelf_s.setVisible(false);
        skills.setVisible(false);
        this.objects_bs = { bookshelf, bookshelf_s, skills };
    }

    update() {
        this.bedPopup.update();
        this.contactPopup.update();
        this.projectsPopup.update(); // ✅ Added

        // Stop player when popup is open
        if (this.contactPopup.open || this.bedPopup.open || this.projectsPopup.open) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
        }

        // -------------------------------
        // PLAYER MOVEMENT + DEPTH
        // -------------------------------
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

            // Open popup for highlighted object
            if (this.objects_c.cabinet_s.visible) {
                this.contactPopup.show();
            } else if (this.objects_b.bed_s.visible) {
                this.bedPopup.show();
            } else if (this.objects_l.laptop_s.visible) {
                this.projectsPopup.show();
            }
        }
    }
}
