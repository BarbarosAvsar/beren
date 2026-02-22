/**
 * @class AppState
 * @description Manages the application-level state: scene, dance, movement,
 * gallery, hide-and-seek. Extends EventTarget for reactive updates.
 */
export class AppState extends EventTarget {
    static STORAGE_KEY = 'robo-gallery-v9';
    static MAX_GALLERY = 15;

    static DANCE_STYLES = [
        { name: 'Bounce', cssClass: 'dance-bounce' },
        { name: 'Twist', cssClass: 'dance-twist' },
        { name: 'Shimmy', cssClass: 'dance-shimmy' },
        { name: 'Disco', cssClass: 'dance-disco' },
    ];

    static THEMES = [
        'Factory', 'Space', 'Moon', 'Jungle', 'Mars',
        'Underwater', 'Candy', 'Volcano', 'Arctic', 'Sunset', 'Haunted', 'Disco'
    ];

    #themeIndex = 0;
    #danceIndex = 0;
    #isDancing = false;
    #isMoving = false;
    #movePos = { x: 0, y: 0 };
    #gallery = [];
    #toast = '';
    #isCapturing = false;
    #showGallery = false;
    #flashActive = false;
    #isHideAndSeek = false;
    #hideSeekScore = 0;
    #hideSeekTimeout = null;
    #hideSeekTimerInterval = null;
    #hideSeekSecondsLeft = 30;

    constructor() {
        super();
        this.#loadGallery();
    }

    // ── Accessors ─────────────────────────────────────────────────────────────
    get theme() { return AppState.THEMES[this.#themeIndex]; }
    get themeIndex() { return this.#themeIndex; }
    get danceIndex() { return this.#danceIndex; }
    get isDancing() { return this.#isDancing; }
    get isMoving() { return this.#isMoving; }
    get movePos() { return { ...this.#movePos }; }
    get gallery() { return [...this.#gallery]; }
    get toast() { return this.#toast; }
    get isCapturing() { return this.#isCapturing; }
    get showGallery() { return this.#showGallery; }
    get flashActive() { return this.#flashActive; }
    get isHideAndSeek() { return this.#isHideAndSeek; }
    get hideSeekScore() { return this.#hideSeekScore; }
    get hideSeekSecondsLeft() { return this.#hideSeekSecondsLeft; }
    get currentDance() { return AppState.DANCE_STYLES[this.#danceIndex]; }

    #emit(type, detail = {}) {
        this.dispatchEvent(new CustomEvent(type, { detail }));
    }

    // ── Theme ─────────────────────────────────────────────────────────────────
    nextTheme() {
        this.#themeIndex = (this.#themeIndex + 1) % AppState.THEMES.length;
        this.#emit('themeChange', { theme: this.theme });
    }

    // ── Dance ─────────────────────────────────────────────────────────────────
    toggleDance() {
        if (this.#isDancing) {
            this.#isDancing = false;
            this.#emit('danceChange', { isDancing: false });
        } else {
            this.#danceIndex = (this.#danceIndex + 1) % AppState.DANCE_STYLES.length;
            this.#isDancing = true;
            this.#emit('danceChange', { isDancing: true, dance: this.currentDance });
        }
    }

    // ── Movement ──────────────────────────────────────────────────────────────
    toggleMove() {
        this.#isMoving = !this.#isMoving;
        this.#emit('moveChange', { isMoving: this.#isMoving });
    }

    /** Called by movement interval to advance position; preserves position across toggles. */
    advancePosition() {
        const nextX = this.#movePos.x + (Math.random() - 0.5) * 150;
        const nextY = this.#movePos.y + (Math.random() - 0.5) * 60;
        this.#movePos = {
            x: Math.max(-250, Math.min(250, nextX)),
            y: Math.max(-100, Math.min(50, nextY))
        };
        this.#emit('positionChange', { pos: this.movePos });
    }

    resetPosition() {
        this.#movePos = { x: 0, y: 0 };
        this.#emit('positionChange', { pos: this.movePos });
    }

    // ── Gallery ───────────────────────────────────────────────────────────────
    #loadGallery() {
        try {
            const raw = localStorage.getItem(AppState.STORAGE_KEY);
            if (raw) this.#gallery = JSON.parse(raw);
        } catch (_) { this.#gallery = []; }
    }

    #saveGallery() {
        try { localStorage.setItem(AppState.STORAGE_KEY, JSON.stringify(this.#gallery)); }
        catch (_) { }
    }

    addPhoto(dataUrl, robotName) {
        const entry = { id: Date.now(), name: robotName, image: dataUrl };
        this.#gallery = [entry, ...this.#gallery].slice(0, AppState.MAX_GALLERY);
        this.#saveGallery();
        this.#emit('galleryChange', { gallery: this.gallery });
    }

    setCapturing(val) {
        this.#isCapturing = val;
        this.#emit('capturingChange', { isCapturing: val });
    }

    openGallery() { this.#showGallery = true; this.#emit('galleryVisibility', { show: true }); }
    closeGallery() { this.#showGallery = false; this.#emit('galleryVisibility', { show: false }); }

    // ── Flash ─────────────────────────────────────────────────────────────────
    triggerFlash() {
        this.#flashActive = true;
        this.#emit('flash', { active: true });
        setTimeout(() => {
            this.#flashActive = false;
            this.#emit('flash', { active: false });
        }, 150);
    }

    // ── Toast ─────────────────────────────────────────────────────────────────
    showToast(message, duration = 2000) {
        this.#toast = message;
        this.#emit('toast', { message });
        setTimeout(() => {
            this.#toast = '';
            this.#emit('toast', { message: '' });
        }, duration);
    }

    // ── Hide & Seek ───────────────────────────────────────────────────────────
    startHideAndSeek() {
        if (this.#isHideAndSeek) {
            this.cancelHideAndSeek();
            return;
        }
        this.#isHideAndSeek = true;
        this.#hideSeekSecondsLeft = 30;
        this.#emit('hideSeekChange', {
            active: true,
            score: this.#hideSeekScore,
            secondsLeft: this.#hideSeekSecondsLeft
        });

        // Countdown timer
        this.#hideSeekTimerInterval = setInterval(() => {
            this.#hideSeekSecondsLeft--;
            this.#emit('hideSeekTimer', { secondsLeft: this.#hideSeekSecondsLeft });
            if (this.#hideSeekSecondsLeft <= 0) {
                this.#clearHideSeekTimers();
                this.#emit('hideSeekTimeout', {});
                this.#isHideAndSeek = false;
                this.#emit('hideSeekChange', { active: false, score: this.#hideSeekScore });
            }
        }, 1000);
    }

    foundRobot() {
        if (!this.#isHideAndSeek) return;
        this.#hideSeekScore++;
        this.#clearHideSeekTimers();
        this.#isHideAndSeek = false;
        this.#emit('hideSeekFound', { score: this.#hideSeekScore });
        this.#emit('hideSeekChange', { active: false, score: this.#hideSeekScore });
    }

    cancelHideAndSeek() {
        this.#clearHideSeekTimers();
        this.#isHideAndSeek = false;
        this.#emit('hideSeekChange', { active: false, score: this.#hideSeekScore });
    }

    #clearHideSeekTimers() {
        if (this.#hideSeekTimerInterval) { clearInterval(this.#hideSeekTimerInterval); this.#hideSeekTimerInterval = null; }
        if (this.#hideSeekTimeout) { clearTimeout(this.#hideSeekTimeout); this.#hideSeekTimeout = null; }
    }
}
