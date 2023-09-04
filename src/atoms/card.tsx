import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle';

import Box from './box';
import {Theme} from './theme';

const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([createVariant({themeKey: 'cardVariants'})], Box);

Card.defaultProps = {
  variant: 'default',
};
export default Card;
