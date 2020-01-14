// Usage:
// replace the ../tfm-front by the folder you want to parse, edit the exclude-dir to match stuff you need to exclude in your project
// grep --exclude-dir={node_modules,lcov-report} -rw '../tfm-front/src' -e "from '@thefork/react-chili'" | awk -F ":" '{print $1}' | xargs node transform-react-chili-imports
//
// Before commiting do a check with `git diff | grep undefined -B10` in your target repo
// it will show you any import that did not migrate well


const fs = require('fs');

const getReactChiliImport = require('./getReactChiliImport');
const transformImport = require('./transformImport');

const filePaths = process.argv.slice(2);

filePaths.forEach((filePath, index) => {
  console.log(`[${index + 1}/${filePaths.length}] file ${filePath}`);
  const file = fs.readFileSync(filePath, 'utf8');
  const importString = getReactChiliImport(file);
  const newImport = transformImport(importString);

  fs.writeFileSync(filePath, file.replace(importString, newImport), null, 2);
});
