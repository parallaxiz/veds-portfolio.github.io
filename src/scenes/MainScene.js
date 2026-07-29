import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        const { width, height } = this.scale; // Width: 1920, Height: 1200

        this.inputLocked = true; // Lock player input initially until game start overlay is clicked
        this.lastActiveObject = null;
        this.nextStepTime = 0;

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
        // DYNAMIC ATMOSPHERE & LIGHT EFFECTS
        // -------------------------------
        // 1. Window Light Shaft (ADD Blendmode)
        const lightShaft = this.add.polygon(0, 0, [
            { x: 220 * scale, y: 150 * scale }, // Top left of window
            { x: 380 * scale, y: 220 * scale }, // Top right of window
            { x: 1000 * scale, y: 1100 * scale }, // Bottom right on floor
            { x: 550 * scale, y: 1100 * scale }  // Bottom left on floor
        ], 0xfff3a8, 0.12);
        lightShaft.setOrigin(0, 0);
        lightShaft.setBlendMode(Phaser.BlendModes.ADD);
        lightShaft.setDepth(1.5);

        this.tweens.add({
            targets: lightShaft,
            alpha: { from: 0.08, to: 0.18 },
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

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

        // 2. Laptop screen flickering glow (ADD Blendmode)
        const laptopGlow = this.add.ellipse(laptop.x, laptop.y - 12 * scale, 35 * scale, 18 * scale, 0x00ffff, 0.35);
        laptopGlow.setBlendMode(Phaser.BlendModes.ADD);
        laptopGlow.setDepth(laptop.depth + 0.05);

        this.tweens.add({
            targets: laptopGlow,
            alpha: { from: 0.15, to: 0.5 },
            scaleX: { from: 0.9, to: 1.1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 120,
            yoyo: true,
            repeat: -1,
            ease: "Bounce.easeInOut"
        });

        // Bookshelf + Skills
        const bookshelf = createObject("bookshelf", 600, 400, 887, 92);
        const bookshelf_s = createObject("bookshelf_s", 600, 400, 887, 92, 2);
        const skills = createObject("skills", 600, 400, 329, -155);
        bookshelf_s.setVisible(false);
        skills.setVisible(false);
        this.objects_bs = { bookshelf, bookshelf_s, skills };

        // -------------------------------
        // PROXIMITY DIALOGUE BUBBLES ("E" Prompts)
        // -------------------------------
        const createBubble = (x, y) => {
            const container = this.add.container(x, y).setDepth(20).setVisible(false).setAlpha(0);
            
            const bg = this.add.graphics();
            bg.fillStyle(0xe2933f, 1);
            bg.lineStyle(3, 0x3e3b66, 1);
            bg.fillRoundedRect(-16, -16, 32, 32, 6);
            bg.strokeRoundedRect(-16, -16, 32, 32, 6);
            
            // Tail
            bg.beginPath();
            bg.moveTo(-6, 16);
            bg.lineTo(6, 16);
            bg.lineTo(0, 22);
            bg.closePath();
            bg.fillPath();
            bg.strokePath();

            const text = this.add.text(0, 0, "E", {
                fontFamily: "'edit-undo', monospace",
                fontSize: "16px",
                color: "#ffffff"
            }).setOrigin(0.5);

            container.add([bg, text]);
            
            this.tweens.add({
                targets: container,
                y: y - 10,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });

            return container;
        };

        this.bubbles = {
            bed: createBubble(bed.x, bed.y - 120 * scale),
            cabinet: createBubble(cabinet.x, cabinet.y - 150 * scale),
            laptop: createBubble(laptop.x, laptop.y - 65 * scale),
            bookshelf: createBubble(bookshelf.x, bookshelf.y - 180 * scale)
        };

        // -------------------------------
        // EVENT BUS FOR REACT COMMUNICATION
        // -------------------------------
        this.mobileInput = { up: false, down: false, left: false, right: false };

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
        this.onChangeSpriteTint = (e) => {
            const color = e.detail.color;
            if (color === "#ffffff") {
                this.player.clearTint();
            } else {
                const hex = color.replace("#", "0x");
                this.player.setTint(parseInt(hex));
            }
        };
        this.onMobileMove = (e) => {
            const { dir, active } = e.detail;
            this.mobileInput[dir] = active;
        };

        window.addEventListener("start-game", this.onStartGame);
        window.addEventListener("open-modal", this.onOpenModal);
        window.addEventListener("close-modal", this.onCloseModal);
        window.addEventListener("change-sprite-tint", this.onChangeSpriteTint);
        window.addEventListener("mobile-move", this.onMobileMove);

        // Cleanup events on scene shutdown
        this.events.once("shutdown", () => {
            window.removeEventListener("start-game", this.onStartGame);
            window.removeEventListener("open-modal", this.onOpenModal);
            window.removeEventListener("close-modal", this.onCloseModal);
            window.removeEventListener("change-sprite-tint", this.onChangeSpriteTint);
            window.removeEventListener("mobile-move", this.onMobileMove);
        });
    }

    update() {
        if (this.inputLocked) {
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

        const walkUp = up.isDown || this.mobileInput.up;
        const walkDown = down.isDown || this.mobileInput.down;
        const walkLeft = left.isDown || this.mobileInput.left;
        const walkRight = right.isDown || this.mobileInput.right;

        player.setVelocity(0);
        if (walkUp && walkLeft) {
            player.setVelocity(-speed * 0.7, -speed * 0.7);
            player.anims.play("walk-up-left", true);
        } else if (walkUp && walkRight) {
            player.setVelocity(speed * 0.7, -speed * 0.7);
            player.anims.play("walk-up-right", true);
        } else if (walkDown && walkLeft) {
            player.setVelocity(-speed * 0.7, speed * 0.7);
            player.anims.play("walk-down-left", true);
        } else if (walkDown && walkRight) {
            player.setVelocity(speed * 0.7, speed * 0.7);
            player.anims.play("walk-down-right", true);
        } else if (walkUp) {
            player.setVelocityY(-speed);
            player.anims.play("walk-up", true);
        } else if (walkDown) {
            player.setVelocityY(speed);
            player.anims.play("walk-down", true);
        } else if (walkLeft) {
            player.setVelocityX(-speed);
            player.anims.play("walk-left", true);
        } else if (walkRight) {
            player.setVelocityX(speed);
            player.anims.play("walk-right", true);
        } else {
            player.anims.stop();
        }

        // Step SFX walking sound trigger
        if ((player.body.velocity.x !== 0 || player.body.velocity.y !== 0)) {
            const now = this.time.now;
            if (now > this.nextStepTime) {
                this.nextStepTime = now + 340;
                if (window.portfolioSFX) {
                    window.portfolioSFX.playStep();
                }
            }
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

        objectGroups.forEach(({ key, normal }) => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, normal.x, normal.y);
            const detectionRadius = key === "bookshelf" ? 200 : 120;
            if (distance < detectionRadius && distance < minDistance) {
                minDistance = distance;
                activeObject = key;
            }
        });

        // Toggle selected state and bubbles
        objectGroups.forEach(({ key, normal, selected }) => {
            const isNear = key === activeObject;
            const bubble = this.bubbles[key];

            if (isNear) {
                normal.setVisible(false);
                selected.forEach(obj => obj.setVisible(true));
                if (bubble && (!bubble.visible || bubble.alpha === 0)) {
                    bubble.setVisible(true);
                    this.tweens.add({ targets: bubble, alpha: 1, duration: 180 });
                }
            } else {
                normal.setVisible(true);
                selected.forEach(obj => obj.setVisible(false));
                if (bubble && bubble.visible && bubble.alpha > 0) {
                    this.tweens.add({
                        targets: bubble,
                        alpha: 0,
                        duration: 180,
                        onComplete: () => bubble.setVisible(false)
                    });
                }
            }
        });

        // Proximity Dialogue Event dispatch
        if (activeObject !== this.lastActiveObject) {
            this.lastActiveObject = activeObject;
            if (activeObject) {
                let text = "";
                let name = "";
                if (activeObject === "bed") {
                    name = "Cozy Bed";
                    text = "My bed. Awards for hackathons and coding achievements were celebrated right here. (Press E or Click to view About Me)";
                } else if (activeObject === "cabinet") {
                    name = "Wardrobe & Mail";
                    text = "A double doors closet. Let's customize my clothes or view my inbox! (Press E or Click to open Cabinet)";
                } else if (activeObject === "laptop") {
                    name = "Developer PC Rig";
                    text = "Workstation rig. Where physics-aware AI pipelines and SAT-MethaneNet were compiled. (Press E or Click to view Projects / Snake)";
                } else if (activeObject === "bookshelf") {
                    name = "Study Library";
                    text = "A collection of AI research papers, WebDev documentations, and CS books. (Press E or Click to view Skills)";
                }
                window.dispatchEvent(new CustomEvent("proximity-enter", { 
                    detail: { text, name, object: activeObject } 
                }));
            } else {
                window.dispatchEvent(new CustomEvent("proximity-leave"));
            }
        }

        // -------------------------------
        // INTERACT VIA "E" KEY
        // -------------------------------
        if (Phaser.Input.Keyboard.JustDown(this.keys.interactKey)) {
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
