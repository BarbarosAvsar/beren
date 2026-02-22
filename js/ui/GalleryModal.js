/**
 * @class GalleryModal
 * @description Full-screen gallery overlay showing captured robot photos as sticker cards.
 * Handles open/close transitions and photo download functionality.
 */
export class GalleryModal {
    /** @type {HTMLElement} */
    #modal;
    /** @type {HTMLElement} */
    #grid;
    /** @type {Function} */
    #onClose;

    /**
     * @param {HTMLElement} modalEl  - The gallery modal element.
     * @param {HTMLElement} gridEl   - The gallery grid element.
     * @param {Function}    onClose  - Callback invoked when user closes the gallery.
     */
    constructor(modalEl, gridEl, onClose) {
        this.#modal = modalEl;
        this.#grid = gridEl;
        this.#onClose = onClose;
        this.#setupClose();
    }

    #setupClose() {
        document.getElementById('gallery-close')?.addEventListener('click', () => {
            this.hide();
            this.#onClose?.();
        });

        // Close on backdrop click (outside the white panel)
        this.#modal.addEventListener('click', (e) => {
            if (e.target === this.#modal) {
                this.hide();
                this.#onClose?.();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.#modal.classList.contains('hidden')) {
                this.hide();
                this.#onClose?.();
            }
        });
    }

    /**
     * Opens the gallery and renders the provided photos.
     * @param {Array<{id:number, name:string, image:string}>} photos
     */
    show(photos) {
        this.#renderPhotos(photos);
        this.#modal.classList.remove('hidden');
        this.#modal.classList.add('gallery-modal-visible');
    }

    hide() {
        this.#modal.classList.remove('gallery-modal-visible');
        setTimeout(() => this.#modal.classList.add('hidden'), 300);
    }

    /**
     * Re-renders the photo grid without reopening the modal.
     * @param {Array<{id:number, name:string, image:string}>} photos
     */
    updatePhotos(photos) {
        if (!this.#modal.classList.contains('hidden')) {
            this.#renderPhotos(photos);
        }
    }

    #renderPhotos(photos) {
        if (photos.length === 0) {
            this.#grid.innerHTML = `
        <div class="gallery-empty">
          <div class="gallery-empty-icon">📸</div>
          <p class="gallery-empty-text">Click SNAP to add stickers!</p>
        </div>
      `;
            return;
        }

        this.#grid.innerHTML = photos.map((entry, idx) => {
            const tilt = idx % 2 === 0 ? -4 : 4;
            return `
        <div class="gallery-card" style="--tilt:${tilt}deg" data-id="${entry.id}">
          <div class="gallery-photo">
            <img src="${entry.image}" alt="Robot ${entry.name}" loading="lazy" />
            <div class="gallery-photo-sheen"></div>
          </div>
          <div class="gallery-card-footer">
            <span class="gallery-card-name">${entry.name}</span>
            <button class="gallery-download-btn" data-img="${entry.image}" data-name="${entry.name}" aria-label="Download ${entry.name} sticker">
              ⬇️
            </button>
          </div>
          <span class="gallery-deco gallery-deco-tl">⭐</span>
          <span class="gallery-deco gallery-deco-br">✨</span>
        </div>
      `;
        }).join('');

        // Wire download buttons
        this.#grid.querySelectorAll('.gallery-download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.#downloadPhoto(btn.dataset.img, btn.dataset.name);
            });
        });
    }

    /**
     * Downloads a photo as a PNG file.
     * @param {string} dataUrl - Base64 data URL of the image.
     * @param {string} name    - Robot name to use in filename.
     */
    #downloadPhoto(dataUrl, name) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `Robot-${name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
