const START_CAPTURING_TEXT = "Start capturing";
const STOP_CAPTURING_TEXT = "Stop capturing";

let options = {};
let captureTasks = [];
let count = 0;
let isCapturing = false;
let contaienr, button, span;

const updateMessage = () => {
  if (!span) return;
  const time = count / options.framerate;
  const m = Math.floor(time / 60);
  const s = time % 60;
  const mText = `${m}`.padStart(2, "0");
  const sText = s.toFixed(1).padStart(4, "0");
  span.innerText = `${mText}:${sText}`;
};

const makeBuffer = async () => {
  const index = count++;
  const numbering = `${index}`.padStart(4, "0");
  const filename = `frame-${numbering}.${options.extension}`;

  let mimeType;
  const extension = options.extension.toLowerCase();
  switch (extension) {
    case "png":
      mimeType = "image/png";
      break;
    case "jpeg":
      mimeType = "image/jpeg";
      break;
    case "jpg":
      mimeType = "image/jpeg";
      break;
    default:
      mimeType = "image/png";
      break;
  }

  const canvas = this._curElement.elt;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType));
  const arrayBuffer = await blob.arrayBuffer();
  const uint8array = new Uint8Array(arrayBuffer);
  return { index, filename, uint8array };
};

const startCaptring = () => {
  isCapturing = true;
  button.innerText = STOP_CAPTURING_TEXT;

  const frameFactory = setInterval(async () => {
    if (!isCapturing) {
      clearInterval(frameFactory);
      const buffer = await Promise.all(captureTasks);
      downloadZip(buffer);
      captureTasks = [];
      count = 0;
      button.innerText = START_CAPTURING_TEXT;
      button.disabled = false;
      updateMessage();
      return;
    }

    const p = makeBuffer();
    captureTasks.push(p);
    await p;
    updateMessage();
  }, 1000 / options.framerate);
};

const stopCapturing = () => {
  isCapturing = false;
  button.disabled = true;
};

const createContainer = (parent) => {
  if (!parent) return;
  container = document.createElement("div");
  container.style.margin = "12px";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.display = "flex";
  container.style.gap = "8px";
  parent.appendChild(container);
  return container;
};

const createButton = (parent) => {
  if (!parent) return;
  button = document.createElement("button");
  button.innerText = START_CAPTURING_TEXT;
  button.onclick = (e) => {
    e.stopPropagation();
    if (isCapturing) {
      stopCapturing();
    } else {
      startCaptring();
    }
  };
  parent.appendChild(button);
  return button;
};

const createSpan = (parent) => {
  if (!parent) return;
  span = document.createElement("span");
  span.style.color = "white";
  span.style.textShadow = "0 0 4px black";
  updateMessage(span);
  parent.appendChild(span);
  return span;
};

const createElements = (parent) => {
  if (!parent) return;
  const container = createContainer(parent);
  createButton(container);
  createSpan(container);
};

const downloadZip = (buffer) => {
  if (buffer.length === 0) return;
  const dirName = "frames";

  const images = {};
  buffer
    .sort((a, b) => a.index - b.index)
    .forEach(({ filename, uint8array }) => {
      images[filename] = [uint8array, { level: 0 }];
    });

  // create zip file
  const zipped = fflate.zipSync({ [dirName]: images });
  const blob = new Blob([zipped], { type: "application/zip" });

  // download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${dirName}.zip`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};

const initialize = () => {
  options = {
    framerate: window.P5_SAVE_FRAMES_FRAMERATE || 30,
    extension: window.P5_SAVE_FRAMES_EXTENSION || "png",
    uiParent: window.P5_SAVE_FRAMES_UI_PARENT || document.body,
  };

  createElements(options.uiParent);
};

p5.prototype.registerMethod("init", initialize);
