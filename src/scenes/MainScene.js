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
        const WORLD_WIDTH = 1920;
        const WORLD_HEIGHT = 1080;
        const ROOM_OFFSET_X = 40;
        const ROOM_OFFSET_Y = -70;

        this.bg = this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "background").setOrigin(0.5);
        const scaleX = WORLD_WIDTH / this.bg.width;
        const scaleY = WORLD_HEIGHT / this.bg.height;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);
        this.bg.setPipeline("TextureTintPipeline");
        this.textures.get("background").setFilter(Phaser.Textures.FilterMode.NEAREST);

        const shapes = this.cache.json.get("roomShape");
        this.roomCollider = this.matter.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "background", null, {
            shape: shapes["background"],
            isStatic: true
        });
        this.roomCollider.setBody(shapes.background);
        this.roomCollider.setStatic(true).setVisible(false);

        const colliderScaleX = WORLD_WIDTH / this.roomCollider.width;
        const colliderScaleY = WORLD_HEIGHT / this.roomCollider.height;
        this.roomCollider.setScale(colliderScaleX + 1, colliderScaleY + 1);
        this.roomCollider.setPosition(WORLD_WIDTH / 2 + ROOM_OFFSET_X, WORLD_HEIGHT / 2 + ROOM_OFFSET_Y);



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

        // -------------------------------
        // CAMERA FOLLOW & CENTERING
        // -------------------------------
        const bgBounds = this.bg.getBounds();

        const updateZoom = () => {
            const isMobileScreen = window.innerWidth < 768 || this.sys.game.device.input.touch;
            const zoom = isMobileScreen ? 1.3 : 1.15;
            this.cameras.main.setZoom(zoom);

            const visibleWidth = this.scale.width / zoom;
            const visibleHeight = this.scale.height / zoom;

            if (visibleWidth >= WORLD_WIDTH || visibleHeight >= WORLD_HEIGHT) {
                // Viewport is larger than room bounds (zoomed out or large display)
                this.cameras.main.removeBounds();
                if (visibleWidth >= WORLD_WIDTH && visibleHeight >= WORLD_HEIGHT) {
                    this.cameras.main.stopFollow();
                    this.cameras.main.centerOn(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
                } else {
                    if (!this.cameras.main._follow) {
                        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
                    }
                }
            } else {
                // Normal view -> Bounded camera following player
                this.cameras.main.setBounds(bgBounds.x, bgBounds.y, bgBounds.width, bgBounds.height);
                if (!this.cameras.main._follow) {
                    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
                }
            }
        };
        updateZoom();

        this.scale.on("resize", updateZoom);

        // Enable debug rendering to show physics bodies (including player hitbox)
        this.matter.world.createDebugGraphic();

        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
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

        // Bed
        const bed = createObject("bed", 600, 592, 221, -85);
        const bed_s = createObject("bed_s", 600, 592, 213, -85, 2);
        bed_s.setVisible(false);
        this.objects_b = { bed, bed_s };

        // Cabinet
        const cabinet = createObject("cabinet", 600, 400, 520, 187);
        const cabinet_s = createObject("cabinet_s", 600, 400, 520, 187, 2);
        cabinet_s.setVisible(false);
        this.objects_c = { cabinet, cabinet_s };

        // Laptop
        const laptop = createObject("laptop", 600, 400, -104, 230, 2);
        const laptop_s = createObject("laptop_s", 600, 400, -104, 230, 2);
        laptop_s.setVisible(false);
        this.objects_l = { laptop, laptop_s };

        // Bookshelf
        const bookshelf = createObject("bookshelf", 600, 350, 833, 92);
        const bookshelf_s = createObject("bookshelf_s", 600, 350, 833, 92, 2);
        bookshelf_s.setVisible(false);
        this.objects_bs = { bookshelf, bookshelf_s };

        // -------------------------------
        // PROXIMITY DIALOGUE BUBBLES ("E" Prompts)
        // -------------------------------
        const createBubble = (x, y) => {
            const container = this.add.container(x, y).setDepth(20).setVisible(false).setAlpha(0);

            const bg = this.add.graphics();
            bg.fillStyle(0xe2933f, 1);
            bg.lineStyle(3, 0x3e3b66, 1);
            // enlarged bubble
            bg.fillRoundedRect(-24, -24, 48, 48, 8);
            bg.strokeRoundedRect(-24, -24, 48, 48, 8);

            // Tail (adjusted position)
            bg.beginPath();
            bg.moveTo(-6, 24);
            bg.lineTo(6, 24);
            bg.lineTo(0, 30);
            bg.closePath();
            bg.fillPath();
            bg.strokePath();

            const text = this.add.text(0, 0, "E", {
                fontFamily: "'edit-undo', monospace",
                fontSize: "24px",
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
            bed: createBubble(bed.x, bed.y - 30 * scale),
            cabinet: createBubble(cabinet.x, cabinet.y - 20 * scale),
            laptop: createBubble(laptop.x, laptop.y - 22 * scale),
            bookshelf: createBubble(bookshelf.x, bookshelf.y - 30 * scale)
        };

        // -------------------------------
        // EVENT BUS FOR REACT COMMUNICATION
        // -------------------------------
        this.isTouchDevice = this.sys.game.device.input.touch || ("ontouchstart" in window);
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
        this.onMobileInteract = () => {
            if (this.objects_c.cabinet_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "contact" }));
            } else if (this.objects_b.bed_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "about" }));
            } else if (this.objects_l.laptop_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "projects" }));
            } else if (this.objects_bs.bookshelf_s.visible) {
                window.dispatchEvent(new CustomEvent("open-modal", { detail: "skills" }));
            }
        };

        window.addEventListener("start-game", this.onStartGame);
        window.addEventListener("open-modal", this.onOpenModal);
        window.addEventListener("close-modal", this.onCloseModal);
        window.addEventListener("change-sprite-tint", this.onChangeSpriteTint);
        window.addEventListener("mobile-move", this.onMobileMove);
        window.addEventListener("mobile-interact", this.onMobileInteract);

        // Cleanup events on scene shutdown
        this.events.once("shutdown", () => {
            window.removeEventListener("start-game", this.onStartGame);
            window.removeEventListener("open-modal", this.onOpenModal);
            window.removeEventListener("close-modal", this.onCloseModal);
            window.removeEventListener("change-sprite-tint", this.onChangeSpriteTint);
            window.removeEventListener("mobile-move", this.onMobileMove);
            window.removeEventListener("mobile-interact", this.onMobileInteract);
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
        const { w, s, a, d, up, down, left, right } = this.keys;
        const player = this.player;

        const walkUp = w.isDown || up.isDown || this.mobileInput.up;
        const walkDown = s.isDown || down.isDown || this.mobileInput.down;
        const walkLeft = a.isDown || left.isDown || this.mobileInput.left;
        const walkRight = d.isDown || right.isDown || this.mobileInput.right;

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
            { key: "bed", normal: this.objects_b.bed, selected: [this.objects_b.bed_s] },
            { key: "cabinet", normal: this.objects_c.cabinet, selected: [this.objects_c.cabinet_s] },
            { key: "laptop", normal: this.objects_l.laptop, selected: [this.objects_l.laptop_s] },
            { key: "bookshelf", normal: this.objects_bs.bookshelf, selected: [this.objects_bs.bookshelf_s] }
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
                    text = "   My bed. Awards for hackathons and coding achievements were celebrated right here. Press E to view About Me.";
                } else if (activeObject === "cabinet") {
                    name = "Side Table with Drawers";
                    text = "   A side table with drawers holding useful items. Press E to examine the table.";
                } else if (activeObject === "laptop") {
                    name = "Developer PC Rig";
                    text = "   Workstation rig where physics‑aware AI pipelines and SAT‑MethaneNet were compiled. Press E to view Projects or Snake.";
                } else if (activeObject === "bookshelf") {
                    name = "Study Library";
                    text = "   A collection of AI research papers, WebDev documentation, and CS books. Press E to view Skills.";
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
