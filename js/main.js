import { EventBus } from "./core/EventBus.js";
import { GameModel } from "./domain/GameModel.js";
import { RobotModel } from "./domain/RobotModel.js";
import { AudioService } from "./services/AudioService.js";
import { ExhaustService } from "./services/ExhaustService.js";
import { NameService } from "./services/NameService.js";
import { SceneService } from "./services/SceneService.js";
import { AppController } from "./controllers/AppController.js";
import { ControlsView } from "./ui/ControlsView.js";
import { HudView } from "./ui/HudView.js";
import { IconSprite } from "./ui/IconSprite.js";
import { StageView } from "./ui/StageView.js";

function queryRequired(id) {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`Missing element with id \"${id}\".`);
  }
  return node;
}

async function bootstrap() {
  const iconSprite = new IconSprite("./assets/icons.svg");
  await iconSprite.init();

  const bus = new EventBus();
  const nameService = new NameService();
  const robotModel = new RobotModel(bus, nameService);
  const gameModel = new GameModel(bus);

  const controlsView = new ControlsView(bus, queryRequired("controls"));
  const hudView = new HudView(bus, {
    nameButton: queryRequired("name-button"),
    nameText: queryRequired("name-text"),
    emotionButton: queryRequired("emotion-button"),
    emotionText: queryRequired("emotion-text"),
    hideSeekHud: queryRequired("hide-seek-hud"),
    timer: queryRequired("hide-seek-timer"),
    score: queryRequired("hide-seek-score"),
    toast: queryRequired("toast"),
    live: queryRequired("status-live"),
  });

  const stageView = new StageView(bus, {
    region: queryRequired("stage-region"),
    mover: queryRequired("robot-mover"),
    dancer: queryRequired("robot-dancer"),
    assembly: queryRequired("robot-assembly"),
    head: queryRequired("part-head"),
    body: queryRequired("part-body"),
    armLeft: queryRequired("part-arm-left"),
    armRight: queryRequired("part-arm-right"),
    legs: queryRequired("part-legs"),
  });

  const sceneService = new SceneService(queryRequired("scene-layer"));
  const exhaustService = new ExhaustService(queryRequired("exhaust-container"));
  const audioService = new AudioService();

  const controller = new AppController({
    bus,
    robotModel,
    gameModel,
    sceneService,
    exhaustService,
    audioService,
    controlsView,
    hudView,
    stageView,
  });

  controller.init();

  window.addEventListener("beforeunload", () => {
    controller.destroy();
  });
}

bootstrap().catch((error) => {
  const root = document.getElementById("app");
  if (root) {
    root.innerHTML = `<p style=\"padding:16px;color:#fecaca;background:#7f1d1d\">Startup failed: ${error.message}</p>`;
  }
  console.error(error);
});
