const { Parser } = require('acorn')

const paths = require('./paths');

module.exports = (importString) => {
  const ast = Parser.parse(importString, { sourceType: 'module' });
  const importAst = ast.body[0];
  const source = ast.body[0];

  const utilsImports = importAst.specifiers.filter((specifier) => {
    return specifier.type === 'ImportSpecifier' && /^utils/.test(paths[specifier.imported.name]);
  }).reduce((carry, specifier) => {
    return {
      ...carry,
      [paths[specifier.imported.name]]: [...carry[paths[specifier.imported.name]] || [], specifier]
    }
  }, {});

  const otherImports = importAst.specifiers.filter((specifier) => {
    return specifier.type === 'ImportDefaultSpecifier' || !/^utils/.test(paths[specifier.imported.name]);
  });

  return `
    ${Object.entries(utilsImports).reduce((carry, [path, specifiers]) => {
      return `
${carry}
import { ${specifiers.map((specifier) => {
  if (specifier.local.name === specifier.imported.name) {
    return specifier.imported.name;
  }

  return `${specifier.imported.name} as ${specifier.local.name}`;
}).join(', ')} } from '@thefork/react-chili/dist/esm/${path}';
      `.trim()
    }, '')}
    ${otherImports.reduce((carry, specifier) => {
      if (specifier.type === 'ImportDefaultSpecifier') {
        return `
          ${carry}
          import ${specifier.local.name} from '@thefork/react-chili';
        `.trim();
      }

      if (specifier.type === 'ImportSpecifier') {
        return `
          ${carry}
          import ${specifier.local.name} from '@thefork/react-chili/dist/esm/${paths[specifier.imported.name]}';
        `.trim();
      }
    }, '').trim()}
  `.trim().replace(/[^\S\r\n]*import/g, 'import');
};