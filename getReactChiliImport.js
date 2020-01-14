module.exports = (file) => {
  const test = /import([\S\s](?!import))*?react-chili(['"]);/
  const matches = file.match(test);

  if (!matches) return null;

  return matches[0];
}