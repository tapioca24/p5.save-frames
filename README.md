# p5.save-frames

p5.js extension for capturing asequence of frames

## Why p5.save-frames?

p5.save-frames is similar to the built-in [`saveFrames`](https://p5js.org/reference/#/p5/saveFrames) function in that it captures a sequence of frames.
This can be useful for creating a movie offline using tools such as ffmpeg.

However, the `saveFrames` function has some limitations:

- Need to edit the code to save the frames
- Need to specify the duration beforehand
- Duration is limited to 15 seconds
- Zip file download is not supported

p5.save-frames has the following features:

- No need to add any code to your JavaScript file
- GUI to control the start and stop of the capture
- No duration limitation
- Zip file download

Thus, you can easily add the ability to save frames to your sketches.

## Installation

### CDN

Add two scripts to your HTML file.  
Use [fflate](https://www.npmjs.com/package/fflate) as a dependency.

```html
<script src="https://cdn.jsdelivr.net/npm/fflate"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.save-frames"></script>
```

## Usage

1. When the script is loaded, the GUI will appear in the upper left corner of the screen
2. Press the button to start capturing
3. Press the button again to stop capturing

That's it.  
A sequence of frames will be downloaded as a zip file.

## Configuration

You can change the behavior by specifying some global variables.

| Variables                  | Default         | Description                       |
| -------------------------- | --------------- | --------------------------------- |
| `P5_SAVE_FRAMES_FRAMERATE` | `30`            | Framerate to save the frames in   |
| `P5_SAVE_FRAMES_EXTENSION` | `"png"`         | Image format. "jpg" or "png"      |
| `P5_SAVE_FRAMES_UI_PARENT` | `document.body` | Parent element to overlay the GUI |

## License

MIT. Copyright (c) tapioca24
