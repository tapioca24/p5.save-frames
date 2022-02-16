import { downloadZip } from "./download";
import { createUi } from "./ui";

let options = {};
let state = "idle";
let count = 0;
let captureTasks = [];
let updateUi;

const makeMimeType = (extension) => {
  const ext = extension.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg") return "image/jpeg";
  if (ext === "jpeg") return "image/jpeg";
  return "image/png";
};

const makeBuffer = async () => {
  const index = count++;
  const numbering = `${index}`.padStart(7, "0");
  const filename = `frame-${numbering}.${options.extension}`;
  const mimeType = makeMimeType(options.extension);

  const canvas = this._curElement.elt;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType));
  const arrayBuffer = await blob.arrayBuffer();
  const uint8array = new Uint8Array(arrayBuffer);
  return { index, filename, uint8array };
};

const resetState = () => {
  state = "idle";
};

const resetVariables = () => {
  count = 0;
  captureTasks = [];
};

const isCapturing = () => {
  return state === "capturing" || state === "downloading";
};

const startCapturing = () => {
  if (state !== "idle") {
    console.warn("capturing is already running");
    return;
  }

  console.log("🎥 start capturing...");
  state = "capturing";
  updateUi(state, count);

  if (options.mode === "async") {
    const frameFactory = setInterval(async () => {
      switch (state) {
        case "capturing":
          const p = makeBuffer();
          captureTasks.push(p);
          await p;
          break;
        case "downloading":
          clearInterval(frameFactory);
          resetState();
          const buffer = await Promise.all(captureTasks);
          downloadZip(buffer, "frames");
          resetVariables();
          break;
      }
      updateUi(state, count);
    }, 1000 / options.framerate);
  }
};

const stopCapturing = () => {
  if (state !== "capturing") {
    console.warn("capturing is not running");
    return;
  }
  console.log("✅ captured");
  state = "downloading";
  updateUi(state, count);
};

const initialize = () => {
  options = {
    mode: window.P5_SAVE_FRAMES_MODE || "sync",
    overrideFramerate: window.P5_SAVE_FRAMES_OVERRIDE_FRAMERATE || false,
    framerate: window.P5_SAVE_FRAMES_FRAMERATE || 30,
    extension: window.P5_SAVE_FRAMES_EXTENSION || "png",
    uiParent: window.P5_SAVE_FRAMES_UI_PARENT || document.body,
  };

  const ui = createUi(options.uiParent);
  updateUi = ui.updateUi;
  ui.button.addEventListener("click", (e) => {
    e.stopPropagation();
    switch (state) {
      case "idle":
        startCapturing();
        break;
      case "capturing":
        stopCapturing();
        break;
    }
  });

  if (options.overrideFramerate) {
    const originalSetup = window.setup;
    const newSetup = () => {
      originalSetup();
      frameRate(options.framerate);
    };

    Object.assign(window, { setup: newSetup });
  }
};

const postDraw = async () => {
  if (options.mode !== "async") {
    if (state === "idle") return;

    switch (state) {
      case "capturing":
        const p = makeBuffer();
        captureTasks.push(p);
        await p;
        break;
      case "downloading":
        resetState();
        const buffer = await Promise.all(captureTasks);
        downloadZip(buffer, "frames");
        resetVariables();
        break;
    }
    updateUi(state, count);
  }
};

p5.prototype.registerMethod("init", initialize);
p5.prototype.registerMethod("post", postDraw);
p5.prototype.startCapturing = startCapturing;
p5.prototype.stopCapturing = stopCapturing;
p5.prototype.isCapturing = isCapturing;
