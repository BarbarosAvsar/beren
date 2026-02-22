import { SoundManager } from './utils/Sound.js';
import { RobotState } from './state/RobotState.js';
import { AppState } from './state/AppState.js';
import { HeadRenderer } from './parts/Heads.js';
import { BodyRenderer } from './parts/Bodies.js';
import { LegRenderer } from './parts/Legs.js';
import { ArmRenderer } from './parts/Arms.js';
import { SceneManager } from './scenes/SceneManager.js';
import { SparkleTrail } from './effects/SparkleTrail.js';
import { ExhaustEffect } from './effects/ExhaustEffect.js';
import { Dashboard } from './ui/Dashboard.js';
import { GalleryModal } from './ui/GalleryModal.js';
import { RobotStage } from './ui/RobotStage.js';

/**
 * @class App
 * @description Root application class. Orchestrates all modules, wires events,
 * and manages the application lifecycle. Implements the Facade pattern to
 * provide a simple interface over the complex subsystem of modules.
 */
class App {
    // ── Module references ────────────────────────────────────────────────────
    #sound;
    #robotState;
    #appState;
    #sceneManager;
    #sparkleTrail;
    #exhaust;
    #dashboard;
    #galleryModal;
    #robotStage;

    constructor() {
        this.#initModules();
        this.#wireEvents();
        this.#initialRender();
    }

    // ── Initialization ────────────────────────────────────────────────────────
    #initModules() {
        this.#sound = new SoundManager();

        this.#robotState = new RobotState(
            HeadRenderer.count,
            BodyRenderer.count,
            LegRenderer.count,
            ArmRenderer.count
        );

        this.#appState = new AppState();

        this.#sceneManager = new SceneManager(document.getElementById('scene-bg'));

        this.#sparkleTrail = new SparkleTrail(document.getElementById('sparkle-layer'));

        this.#exhaust = new ExhaustEffect(document.getElementById('exhaust-container'));

        this.#robotStage = new RobotStage({});

        this.#dashboard = new Dashboard(
            document.getElementById('dashboard'),
            {
                nextTheme: () => this.#onNextTheme(),
                splashColor: () => this.#onSplashColor(),
                changeSize: () => this.#onChangeSize(),
                randomize: () => this.#onRandomize(),
                toggleMove: () => this.#onToggleMove(),
                toggleDance: () => this.#onToggleDance(),
                takePhoto: () => this.#onTakePhoto(),
                openGallery: () => this.#onOpenGallery(),
                toggleHideSeek: () => this.#onToggleHideSeek(),
            }
        );

        this.#galleryModal = new GalleryModal(
            document.getElementById('gallery-modal'),
            document.getElementById('gallery-grid'),
            () => this.#appState.closeGallery()
        );
    }

    #wireEvents() {
        // ── RobotState changes ──────────────────────────────────────────────────
        this.#robotState.addEventListener('change', (e) => {
            const { changed } = e.detail;
            const palette = this.#robotState.palette;

            if (changed === 'all' || changed === 'head') this.#robotStage.renderHead(this.#robotState.headIndex, palette);
            if (changed === 'all' || changed === 'body') this.#renderBody();
            if (changed === 'all' || changed === 'legs') this.#robotStage.renderLegs(this.#robotState.legsIndex, palette);
            if (changed === 'all' || changed === 'arms') this.#robotStage.renderArms(this.#robotState.armsIndex, palette);
            if (changed === 'all' || changed === 'emotion') this.#robotStage.renderEmotion(this.#robotState.emotion);
            if (changed === 'all' || changed === 'scale') this.#robotStage.renderScale(this.#robotState.scale);
            if (changed === 'all' || changed === 'palette') {
                this.#robotStage.renderHead(this.#robotState.headIndex, palette);
                this.#renderBody();
                this.#robotStage.renderLegs(this.#robotState.legsIndex, palette);
                this.#robotStage.renderArms(this.#robotState.armsIndex, palette);
            }
            if (changed === 'all' || changed === 'name') {
                document.getElementById('robot-name-text').textContent = this.#robotState.name;
            }
        });

        // ── AppState events ─────────────────────────────────────────────────────
        this.#appState.addEventListener('themeChange', (e) => {
            this.#sceneManager.render(e.detail.theme);
        });

        this.#appState.addEventListener('danceChange', (e) => {
            if (e.detail.isDancing) {
                this.#robotStage.setDance(e.detail.dance.cssClass);
                this.#sound.startMusic();
                this.#sound.speak(`${e.detail.dance.name}!`);
                // Fire mode when dancing with engine
                if (this.#robotState.bodyHasEngine) this.#exhaust.setMode('fire');
            } else {
                this.#robotStage.setDance(null);
                this.#sound.stopMusic();
                if (this.#robotState.bodyHasEngine) this.#exhaust.setMode('smoke');
            }
            this.#dashboard.setDancing(e.detail.isDancing);
        });

        this.#appState.addEventListener('moveChange', (e) => {
            if (e.detail.isMoving) {
                this.#robotStage.startMoving();
            } else {
                this.#robotStage.stopMoving();
            }
            this.#dashboard.setMoving(e.detail.isMoving);
        });

        this.#appState.addEventListener('galleryChange', (e) => {
            this.#dashboard.setGalleryCount(e.detail.gallery.length);
            this.#galleryModal.updatePhotos(e.detail.gallery);
        });

        this.#appState.addEventListener('galleryVisibility', (e) => {
            if (e.detail.show) {
                this.#galleryModal.show(this.#appState.gallery);
            } else {
                this.#galleryModal.hide();
            }
        });

        this.#appState.addEventListener('flash', (e) => {
            const overlay = document.getElementById('flash-overlay');
            if (overlay) overlay.style.opacity = e.detail.active ? '0.35' : '0';
        });

        this.#appState.addEventListener('toast', (e) => {
            this.#showToast(e.detail.message);
        });

        this.#appState.addEventListener('hideSeekChange', (e) => {
            this.#updateHideSeekHUD(e.detail.active, e.detail.score);
            this.#dashboard.setHideSeekActive(e.detail.active);
            if (!e.detail.active) this.#robotStage.revealRobot();
        });

        this.#appState.addEventListener('hideSeekTimer', (e) => {
            const timerEl = document.getElementById('hide-seek-timer');
            if (timerEl) timerEl.textContent = e.detail.secondsLeft;
            if (e.detail.secondsLeft <= 5) timerEl?.classList.add('hide-seek-timer-urgent');
        });

        this.#appState.addEventListener('hideSeekFound', (e) => {
            this.#sound.playSuccess();
            this.#sound.speak('You found me!');
            this.#appState.showToast(`⭐ Found! Score: ${e.detail.score}`);
            document.getElementById('hide-seek-score').textContent = `⭐ ${e.detail.score}`;
        });

        this.#appState.addEventListener('hideSeekTimeout', () => {
            this.#sound.playScratch();
            this.#appState.showToast("⏰ Time's up! I was here!");
        });

        // ── Robot part click events ─────────────────────────────────────────────
        document.getElementById('robot-stage').addEventListener('click', (e) => {
            const target = e.target.closest('[data-part]');
            if (!target) return;
            const part = target.dataset.part;

            if (this.#appState.isHideAndSeek) return; // Clicks go to robot hide detection

            switch (part) {
                case 'head': this.#sound.playBoing(); this.#robotState.nextHead(); this.#robotStage.triggerMagicBurst(); break;
                case 'body': this.#sound.playBoing(); this.#robotState.nextBody(); this.#robotStage.triggerMagicBurst(); break;
                case 'legs': this.#sound.playBoing(); this.#robotState.nextLegs(); this.#robotStage.triggerMagicBurst(); break;
                case 'arms': this.#sound.playBoing(); this.#robotState.nextArms(); this.#robotStage.triggerMagicBurst(); break;
            }
        });

        // ── Emotion badge ───────────────────────────────────────────────────────
        document.getElementById('emotion-badge')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.#robotState.nextEmotion();
        });

        // ── Name plate ──────────────────────────────────────────────────────────
        document.getElementById('name-plate')?.addEventListener('click', () => {
            this.#sound.playClick();
            this.#robotState.nextName();
        });
    }

    // ── Initial render ────────────────────────────────────────────────────────
    #initialRender() {
        document.getElementById('robot-name-text').textContent = this.#robotState.name;
        this.#robotStage.renderAll(this.#robotState);
        this.#sceneManager.render(this.#appState.theme);
        this.#dashboard.setGalleryCount(this.#appState.gallery.length);
    }

    // ── Body render (with exhaust) ─────────────────────────────────────────────
    #renderBody() {
        this.#robotStage.renderBody(this.#robotState.bodyIndex, this.#robotState.palette);
        // Update exhaust mode based on body + dance/move state
        if (this.#robotState.bodyHasEngine) {
            const mode = this.#appState.isDancing ? 'fire' : 'smoke';
            this.#exhaust.setMode(mode);
        } else {
            this.#exhaust.setMode('off');
        }
    }

    // ── Dashboard action handlers ──────────────────────────────────────────────
    #onNextTheme() {
        this.#sound.playSuccess();
        const prevTheme = this.#appState.theme;
        this.#appState.nextTheme();
        this.#sound.speak(this.#appState.theme);
    }

    #onSplashColor() {
        this.#robotState.splashColor();
        this.#sound.playSuccess();
        this.#sound.speak('Color Splash!');
        this.#robotStage.triggerMagicBurst();
    }

    #onChangeSize() {
        const newScale = this.#robotState.changeSize();
        this.#sound.playBoing();
        const label = newScale > 1.5 ? 'Extra Big!' : newScale < 0.8 ? 'Extra Small!' : 'Resize!';
        this.#sound.speak(label);
        this.#robotStage.triggerMagicBurst();
    }

    #onRandomize() {
        this.#robotState.randomize();
        this.#robotStage.resetPosition();
        this.#sound.playSuccess();
        this.#sound.speak('SUPER MIX!');
        this.#robotStage.triggerMagicBurst();
        this.#appState.showToast('🎲 SUPER MIX!');
    }

    #onToggleMove() {
        this.#sound.playClick();
        this.#appState.toggleMove();
        if (this.#appState.isMoving) {
            this.#robotStage.startMoving();
        } else {
            this.#robotStage.stopMoving();
        }
        this.#dashboard.setMoving(this.#appState.isMoving);
    }

    #onToggleDance() {
        if (this.#appState.isDancing) {
            this.#sound.playScratch();
        }
        this.#appState.toggleDance();
    }

    async #onTakePhoto() {
        if (this.#appState.isCapturing) return;
        this.#appState.setCapturing(true);
        this.#sound.playCamera();
        this.#appState.triggerFlash();

        await new Promise(r => setTimeout(r, 400));

        const stageEl = document.getElementById('robot-stage');
        let dataUrl = null;

        if (stageEl && typeof html2canvas !== 'undefined') {
            try {
                const canvas = await html2canvas(stageEl, {
                    backgroundColor: null,
                    useCORS: true,
                    scale: 1,
                    logging: false,
                });
                dataUrl = canvas.toDataURL('image/png');
            } catch (err) { console.warn('Photo capture failed:', err); }
        }

        if (dataUrl && dataUrl.length > 500) {
            this.#appState.addPhoto(dataUrl, this.#robotState.name);
            this.#appState.showToast('✨ MAGIC STICKER! ✨');
        }

        this.#appState.setCapturing(false);
    }

    #onOpenGallery() {
        this.#sound.playClick();
        this.#appState.openGallery();
    }

    #onToggleHideSeek() {
        if (this.#appState.isHideAndSeek) {
            // If already hiding, pressing again cancels
            this.#appState.cancelHideAndSeek();
        } else {
            this.#sound.playClick();
            this.#appState.startHideAndSeek();
            this.#sound.speak('Find me if you can!');
            this.#appState.showToast('🙈 Find the robot!');
            this.#robotStage.hideRobot(() => {
                this.#appState.foundRobot();
            });
        }
    }

    // ── Toast UI ───────────────────────────────────────────────────────────────
    #showToast(message) {
        const toastEl = document.getElementById('toast');
        if (!toastEl) return;
        if (!message) {
            toastEl.classList.remove('toast-visible');
            toastEl.classList.add('hidden');
            return;
        }
        toastEl.textContent = message;
        toastEl.classList.remove('hidden');
        void toastEl.offsetWidth;
        toastEl.classList.add('toast-visible');
        setTimeout(() => {
            toastEl.classList.remove('toast-visible');
            setTimeout(() => toastEl.classList.add('hidden'), 300);
        }, 1800);
    }

    // ── Hide & Seek HUD ────────────────────────────────────────────────────────
    #updateHideSeekHUD(isActive, score) {
        const hud = document.getElementById('hide-seek-hud');
        if (!hud) return;
        if (isActive) {
            hud.classList.remove('hidden');
            const timerEl = document.getElementById('hide-seek-timer');
            if (timerEl) {
                timerEl.textContent = '30';
                timerEl.classList.remove('hide-seek-timer-urgent');
            }
        } else {
            hud.classList.add('hidden');
        }
        const scoreEl = document.getElementById('hide-seek-score');
        if (scoreEl) scoreEl.textContent = `⭐ ${score}`;
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
