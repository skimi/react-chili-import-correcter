const transformImport = require('./transformImport');

describe('transformImport', () => {
  it('does nothing for the default import', () => {
    const importString = "import test from '@thefork/react-chili';";

    expect(transformImport(importString)).toEqual(importString)
  });

  it('extracts transform the inner import into new lines', () => {
    const importString = "import { Button } from '@thefork/react-chili';";

    expect(transformImport(importString)).toEqual("import Button from '@thefork/react-chili/dist/esm/components/Atoms/Form/Button';")
  });

  it('works for aliases', () => {
    const importString = "import { Button as MyButton } from '@thefork/react-chili';";

    expect(transformImport(importString)).toEqual("import MyButton from '@thefork/react-chili/dist/esm/components/Atoms/Form/Button';")
  });

  it('knows that some component were aliased in the old scheme', () => {
    const importString = "import { IconArrowBottom } from '@thefork/react-chili';";

    expect(transformImport(importString)).toEqual("import IconArrowBottom from '@thefork/react-chili/dist/esm/components/Atoms/Icons/ArrowBottom';")
  });

  it('handles the import of utils in a single block', () => {
    const importString = "import { hsl2hsla, fontScale, px2rem, px2em, rem2em } from '@thefork/react-chili';";

    expect(transformImport(importString)).toEqual(`
import { hsl2hsla } from '@thefork/react-chili/dist/esm/utils/color';
import { fontScale, px2rem, px2em, rem2em } from '@thefork/react-chili/dist/esm/utils/font';
    `.trim())
  })

  it('works all around', () => {
    const importString = "import { Box as ChiliBox, Button, px2rem as toRem } from '@thefork/react-chili';"

    expect(transformImport(importString)).toEqual(`
import { px2rem as toRem } from '@thefork/react-chili/dist/esm/utils/font';
import ChiliBox from '@thefork/react-chili/dist/esm/components/Atoms/Box';
import Button from '@thefork/react-chili/dist/esm/components/Atoms/Form/Button';
    `.trim())
  })
})