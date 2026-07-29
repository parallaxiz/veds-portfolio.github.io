import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        const { width, height } = this.scale; // Width: 1920, Height: 1200

        this.inputLocked = true; // Lock player input initially until game start overlay is clicked

        // -------------------------------
        // BACKGROUND + COLLIDER
        // -------------------------------
        const ROOM_OFFSET_X = 40;
        const ROOM_OFFSET_Y = -70;

        this.bg = this.add.image(width / 2, height / 2, "background").setOrigin(0.5);
        const scaleX = width / this.bg.width;
        const scaleY = height / this.bg.height;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);
        this.bg.setScrollFactor(0);
        this.bg.setPipeline("TextureTintPipeline");
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
        this.roomCollider.setScale(colliderScaleX + 1, colliderScaleY + 1);
        this.roomCollider.setPosition(width / 2 + ROOM_OFFSET_X, height / 2 + ROOM_OFFSET_Y);

        // -------------------------------
        // PLAYER
        // -------------------------------
        const PLAYER_VISUAL_OFFSET_Y = 50; // Shift sprite down by 50 pixels, keep hitbox in place

        this.player = this.matter.add.sprite(910, 780 + PLAYER_VISUAL_OFFSET_Y, "player", 0);
        this.player.setDepth(2).setScale(10);
        this.textures.get("player").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.player.setOrigin(1).setBody({
            type: "rectangle",
            width: this.player.width * 4,
            height: this.player.height * 7,
            offset: { x: 0, y: 300 }
        });
        this.player.setFixedRotation();

        // Enable debug rendering to show physics bodies (including player hitbox)
        this.matter.world.createDebugGraphic();

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
        // OBJECTS CREATION
        // -------------------------------
        const createObject = (name, x, y, offsetX, offsetY, depth = 1) => {
            const obj = this.add.sprite(x, y, name).setOrigin(0.5).setScale(scale).setDepth(depth);
            obj.setPosition(obj.x + offsetX, obj.y + offsetY);
            this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
            return obj;
        }

        // Bed + About Me
        const bed = createObject("bed", 600, 592, 205, -28);
        const bed_s = createObject("bed_s", 600, 592, 197, -28, 2);
        const about_me = createObject("about_me", 600, 400, 63, -221);
        bed_s.setVisible(false);
        about_me.setVisible(false);
        this.objects_b = { bed, bed_s, about_me };

        // Cabinet + Contact Info
        const cabinet = createObject("cabinet", 600, 400, 538, 252);
        const cabinet_s = createObject("cabinet_s", 600, 400, 538, 252, 2);
        const contact_info = createObject("contact_info", 600, 400, 267, -103);
        cabinet_s.setVisible(false);
        contact_info.setVisible(false);
        this.objects_c = { cabinet, cabinet_s, contact_info };

        // Laptop + Projects
        const laptop = createObject("laptop", 600, 400, -156, 299, 2);
        const laptop_s = createObject("laptop_s", 600, 400, -156, 299, 2);
        const projects = createObject("projects", 600, 400, -166, -47);
        laptop_s.setVisible(false);
        projects.setVisible(false);
        this.objects_l = { laptop, laptop_s, projects };

        // Bookshelf + Skills
        const bookshelf = createObject("bookshelf", 600, 400, 887, 92);
        const bookshelf_s = createObject("bookshelf_s", 600, 400, 887, 92, 2);
        const skills = createObject("skills", 600, 400, 329, -155);
        bookshelf_s.setVisible(false);
        skills.setVisible(false);
        this.objects_bs = { bookshelf, bookshelf_s, skills };

        // -------------------------------
        // EVENT BUS FOR REACT COMMUNICATION
        // -------------------------------
        this.onStartGame = () => {
            this.inputLocked = false;
        };
        this.onOpenModal = () => {
            this.inputLocked = true;
            if (this.player && this.player.body) {
                this.player.setVelocity(0);
                this.player.anims.stop();
            }
        };
        this.onCloseModal = () => {
            this.inputLocked = false;
        };

        window.addEventListener("start-game", this.onStartGame);
        window.addEventListener("open-modal", this.onOpenModal);
        window.addEventListener("close-modal", this.onCloseModal);

        // Cleanup events on scene shutdown
        this.events.once("shutdown", () => {
            window.removeEventListener("start-game", this.onStartGame);
            window.removeEventListener("open-modal", this.onOpenModal);
            window.removeEventListener("close-modal", this.onCloseModal);
        });
    }

    update() {
        if (this.inputLocked) {
            // If popups/modals are active and they press the interact key (E), close the active modal
            if (Phaser.Input.Keyboard.JustDown(this.keys.interactKey)) {
                window.dispatchEvent(new CustomEvent("close-modal"));
            }
            if (this.player && this.player.body) {
                this.player.setVelocity(0);
                this.player.anims.stop();
            }
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
            const detectionRadius = key === "bookshelf" ? 200 : 120; // Larger radius for bookshelf
            if (distance < detectionRadius && distance < minDistance) {
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
            // Open popup for highlighted object
            if (this.objects_c.cabinet_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "contact" }));
            } else if (this.objects_b.bed_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "about" }));
            } else if (this.objects_l.laptop_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "projects" }));
            } else if (this.objects_bs.bookshelf_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "skills" }));
            }  
        }
    }
}
