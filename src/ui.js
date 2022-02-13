const START_CAPTURING_TEXT = "Start capturing";
const STOP_CAPTURING_TEXT = "Stop capturing";

const createContainer = (parent) => {
  const container = document.createElement("div");
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
  const button = document.createElement("button");
  button.innerText = START_CAPTURING_TEXT;
  parent.appendChild(button);
  return button;
};

const createSpan = (parent) => {
  const span = document.createElement("span");
  span.style.color = "white";
  span.style.textShadow = "0 0 4px black";
  span.innerText = "00:00.0";
  parent.appendChild(span);
  return span;
};

const getIndicator = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mStr = `${m}`.padStart(2, "0");
  const sStr = s.toFixed(1).padStart(4, "0");
  return `${mStr}:${sStr}`;
};

export const createUi = (parent) => {
  const container = createContainer(parent);
  const button = createButton(container);
  const span = createSpan(container);

  const updateUi = (state, seconds) => {
    switch (state) {
      case "idle":
        button.innerText = START_CAPTURING_TEXT;
        button.disabled = false;
        span.innerText = getIndicator(0);
        break;
      case "capturing":
        button.innerText = STOP_CAPTURING_TEXT;
        button.disabled = false;
        span.innerText = getIndicator(seconds);
        break;
      case "downloading":
        button.innerText = STOP_CAPTURING_TEXT;
        button.disabled = true;
        span.innerText = getIndicator(seconds);
        break;
    }
  };

  return { container, button, span, updateUi };
};
