import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { ZetkinTag } from 'types/zetkin';

const TypeSelect: React.FC<{
  onChange: (value: ZetkinTag['value_type']) => void;
  value: ZetkinTag['value_type'];
}> = ({ onChange, value }) => {
  const intl = useIntl();

  return (
    <Box mb={0.8} mt={1.5}>
      <FormControl data-testid="TypeSelect-formControl">
        <FormLabel>
          <FormattedMessage id={'misc.tags.tagManager.tagDialog.typeLabel'} />
        </FormLabel>
        <RadioGroup
          onChange={(ev) =>
            onChange(
              ev.target.value == 'none'
                ? null
                : (ev.target.value as ZetkinTag['value_type'])
            )
          }
          value={value || 'none'}
        >
          <FormControlLabel
            control={<Radio />}
            label={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.types.none',
            })}
            value="none"
          />
          <FormControlLabel
            control={<Radio />}
            label={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.types.text',
            })}
            value="text"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TypeSelect;
