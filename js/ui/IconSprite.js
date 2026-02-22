export class IconSprite {
  #path;
  #hostId;

  constructor(path, hostId = "icon-sprite-host") {
    this.#path = path;
    this.#hostId = hostId;
  }

  async init() {
    if (document.getElementById(this.#hostId)) {
      return;
    }

    try {
      const response = await fetch(this.#path);
      if (!response.ok) {
        return;
      }

      const text = await response.text();
      const host = document.createElement("div");
      host.id = this.#hostId;
      host.className = "sr-only";
      host.setAttribute("aria-hidden", "true");
      host.innerHTML = text;
      document.body.prepend(host);
    } catch {
      // The app still works with plain labels when sprite load fails.
    }
  }
}
