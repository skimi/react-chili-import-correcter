const getReactChiliImport = require('./getReactChiliImport');``

describe('getReactChiliImport', () => {
  it('get the line where the chili import is', () => {
    const file = `
    import React from 'react';
    import PropTypes from 'prop-types';
    import { IconFloorplanFill, IconTimelineFill } from '@thefork/react-chili';
    import Button from '@thefork/react-components/src/components/Button';

    import { VIEWS } from '$core/app/booking/Overview/domain/constants';

    import styles from './styles.scss';

    const SwitcherFloorplanTimeline = ({ active, ...props }) => (
      <div />
    );

    SwitcherFloorplanTimeline.propTypes = {
      active: PropTypes.string,
    };

    SwitcherFloorplanTimeline.defaultProps = {
      active: VIEWS.FLOORPLAN,
    };

    export default SwitcherFloorplanTimeline
    `;

    expect(getReactChiliImport(file)).toEqual("import { IconFloorplanFill, IconTimelineFill } from '@thefork/react-chili';");
  })

  it('returns null if no match', () => {
    expect(getReactChiliImport('pouet')).toEqual(null);
  });

  it('works with multi line imports', () => {
    const file = `
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/react-components';
import last from 'lodash/last';
import {
  IconBookFill,
  IconBook,
  IconPersonFill,
  IconPerson,
  IconCreditcard,
  IconCreditcardFill,
} from '@thefork/react-chili';

import Tabs, { Item, Icon, Label } from '$core/app/components/FullscreenModal/Tabs';

import reservationHasImprint from './reservationHasImprint.gql';
    `;

    expect(getReactChiliImport(file)).toEqual(`
import {
  IconBookFill,
  IconBook,
  IconPersonFill,
  IconPerson,
  IconCreditcard,
  IconCreditcardFill,
} from '@thefork/react-chili';
    `.trim())
  })
});