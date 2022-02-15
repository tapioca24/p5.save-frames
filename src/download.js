import { zipSync } from "fflate";

export const downloadZip = (buffer, dirName) => {
  if (buffer.length === 0) return;

  const images = {};
  buffer
    .sort((a, b) => a.index - b.index)
    .forEach(({ filename, uint8array }) => {
      images[filename] = [uint8array, { level: 0 }];
    });

  // create zip file
  const zipped = zipSync({ [dirName]: images });
  const blob = new Blob([zipped], { type: "application/zip" });

  // download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${dirName}.zip`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};
