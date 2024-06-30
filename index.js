const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('js-yaml');

try {
  // Parse inputs
  const projectRoot = core.getInput('root', { required: true });
  const localeFile = core.getInput('locale_file', { required: true });

  // Load locale file
  const localeData = yaml.load(fs.readFileSync(`${projectRoot}/${localeFile}`, 'utf8'));

  // Define regex to find translation strings in .go files
  const stringPattern = /\.Trans\("([\S.]+)".*\)/g;

  let hasMissing = false;

  // Recursive function to check if translation string exists in locale data
  function checkTranslationExists(translationString, localeData) {
    const keys = translationString.split('.');
    let currentData = localeData;
    for (const key of keys) {
      if (currentData[key] === undefined) {
        return false;
      }
      currentData = currentData[key];
    }
    return true;
  }

  // Read all .go files and check for missing translations
  const files = fs.readdirSync(projectRoot).filter(file => file.endsWith('.go'));
  files.forEach(file => {
    const content = fs.readFileSync(`${projectRoot}/${file}`, 'utf8');
    let matches;
    while ((matches = stringPattern.exec(content)) !== null) {
      if (!checkTranslationExists(matches[1], localeData)) {
        core.setFailed(`Missing translation string: ${matches[1]} in file ${file}`);
        hasMissing = true;
      }
    }
  });

  if (!hasMissing) {
    core.setOutput("result", "No missing translation strings. Good job!");
  }
} catch (error) {
  core.setFailed(error.message);
}
