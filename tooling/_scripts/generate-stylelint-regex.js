const fs = require('fs');
const path = require('path');
const { WorkTree } = require('./lib/work-tree');
const { LIB, APP, EXTENSIONS } = require('./constants');
const prettier = require('prettier');

const libTree = new WorkTree(LIB);
const appTree = new WorkTree(APP);
const extensionTree = new WorkTree(EXTENSIONS);

const lintFilePath = path.resolve(__dirname, '..', '..', '.stylelintrc.json');

async function run() {
  const styleLint = JSON.parse(fs.readFileSync(lintFilePath, 'utf-8'));

  let result = await Promise.all(
    [libTree, appTree, extensionTree].flatMap(async (wTree) => {
      const packages = await wTree.packages({ detailed: true });

      const result = (
        await Promise.all(
          packages.map(async (pkg) => {
            if ((await pkg.getCSSFiles()).length > 0) {
              return pkg;
            }
          }),
        )
      ).filter(Boolean);

      return result.map((r) => r.name);
    }),
  );

  result = result
    .flatMap((r) => r)
    .map((r) => 'B-' + r.split('@bangle.io/')[1]);

  result.push('BU');

  result.sort();

  let folders = result;
  styleLint.rules['selector-class-pattern'] = [
    `^(${folders.join('|')})_[a-z0-9A-Z\\-]+$`,
    {
      message:
        'Selector should start with the package name followed by an underscore and then the selector name containing only lowercase letters, numbers and hyphens.',
    },
  ];

  styleLint['!!NOTE!!'] =
    'Parts of this file are autogenerated by the tooling/_scripts, run "yarn g:css:stylelint-update-regex" to update.';

  fs.writeFileSync(
    lintFilePath,
    prettier.format(JSON.stringify(styleLint, null, 2), {
      parser: 'json',
    }),
    'utf-8',
  );
}

run();
