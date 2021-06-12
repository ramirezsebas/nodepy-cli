const windowsPath = (filePath) => {
  return new URL(filePath).pathname.substring(1);
};

const currentFilePath = () => {};
