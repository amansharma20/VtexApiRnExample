import {createText} from '@shopify/restyle';

import {Theme} from './theme';

const Text = createText<Theme>();

Text.defaultProps = {
  variant: 'normal',
};

export default Text;
