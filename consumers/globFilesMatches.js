/* eslint-disable no-plusplus */
const { glob } = require('glob');
const path = require('path');

const DEFAULT_EXCLUDED_FOLDER = 'node_modules';

const globFilesMatches = async (baseDir, filePaths, excludedFolder = DEFAULT_EXCLUDED_FOLDER) => {
  if (!baseDir || !filePaths) {
    throw new Error('baseDir and filePaths are required');
  }
  const filteredFiles = [];
  if (filePaths.length > 0) {
    let i = 0;
    do {
      const filePath = filePaths[i];
      const files = glob.sync(path.resolve(baseDir, filePath), { ignore: '**/node_modules/**' });
      const filterFiles = files.filter(file => !file.includes(excludedFolder));
      filteredFiles.push(...filterFiles);
      i++;
    } while (i + 1 < filePaths.length);
  }
  return filteredFiles;
};

module.exports = globFilesMatches;
