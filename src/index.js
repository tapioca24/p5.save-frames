import { downloadZip } from "./download";
import { createUi } from "./ui";

let options = {};
let count = 0;
let captureTasks = [];
let state = "idle";

const makeMimeType = (extension) => {
  const ext = extension.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg") return "image/jpeg";
  if (ext === "jpeg") return "image/jpeg";
  return "image/png";
};

const makeBuffer = async () => {
  const index = count++;
  const numbering = `${index}`.padStart(4, "0");
  const filename = `frame-${numbering}.${options.extension}`;
  const mimeType = makeMimeType(options.extension);

  const canvas = this._curElement.elt;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType));
  const arrayBuffer = await blob.arrayBuffer();
  const uint8array = new Uint8Array(arrayBuffer);
  return { index, filename, uint8array };
};

const resetStatus = () => {
  state = "idle";
  count = 0;
  captureTasks = [];
};

const startCaptring = (updateUi) => {
  state = "capturing";
  updateUi(state, count / options.framerate);

  const frameFactory = setInterval(async () => {
    switch (state) {
      case "capturing":
        const p = makeBuffer();
        captureTasks.push(p);
        await p;
        break;
      case "downloading":
        clearInterval(frameFactory);
        const buffer = await Promise.all(captureTasks);
        downloadZip(buffer, "frames");
        resetStatus();
        break;
    }
    updateUi(state, count / options.framerate);
  }, 1000 / options.framerate);
};

const stopCapturing = (updateUi) => {
  state = "downloading";
  updateUi(state, count / options.framerate);
};

const initialize = () => {
  options = {
    framerate: window.P5_SAVE_FRAMES_FRAMERATE || 30,
    extension: window.P5_SAVE_FRAMES_EXTENSION || "png",
    uiParent: window.P5_SAVE_FRAMES_UI_PARENT || document.body,
  };

  const { button, updateUi } = createUi(options.uiParent);
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    switch (state) {
      case "idle":
        startCaptring(updateUi);
        break;
      case "capturing":
        stopCapturing(updateUi);
        break;
    }
  });
};

p5.prototype.registerMethod("init", initialize);
