export async function readLayerOrder(page) {
  return page.evaluate(() => {
    const mover = document.getElementById("robot-mover");
    const foreground = document.getElementById("scene-foreground");
    return {
      hideTarget: mover.classList.contains("hide-target"),
      moverZ: Number.parseInt(getComputedStyle(mover).zIndex, 10),
      foregroundZ: Number.parseInt(getComputedStyle(foreground).zIndex, 10),
    };
  });
}

export async function readArmBodyDepth(page) {
  return page.evaluate(() => {
    const armLeft = document.getElementById("part-arm-left");
    const armRight = document.getElementById("part-arm-right");
    const body = document.getElementById("part-body");
    return {
      armLeftZ: Number.parseInt(getComputedStyle(armLeft).zIndex, 10),
      armRightZ: Number.parseInt(getComputedStyle(armRight).zIndex, 10),
      bodyZ: Number.parseInt(getComputedStyle(body).zIndex, 10),
    };
  });
}

export async function setIdentityMarkers(page) {
  return page.evaluate(() => {
    const head = document.querySelector("#part-head .robot-piece");
    const body = document.querySelector("#part-body .robot-piece");
    if (!head || !body) {
      return false;
    }

    head.dataset.identityHead = "keep";
    body.dataset.identityBody = "keep";
    return true;
  });
}

export async function readIdentityMarkers(page) {
  return page.evaluate(() => ({
    head: document.querySelector("#part-head .robot-piece")?.dataset.identityHead ?? null,
    body: document.querySelector("#part-body .robot-piece")?.dataset.identityBody ?? null,
  }));
}
