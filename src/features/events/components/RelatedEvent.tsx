import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';

import { getParticipantsStatusColor } from 'features/events/utils/eventUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface RelatedEventProps {
  event: ZetkinEvent;
}

const RelatedEvent: FC<RelatedEventProps> = ({ event }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <NextLink
          href={`/organize/${event.organization.id}/${
            event.campaign ? `projects/${event.campaign.id}` : 'standalone'
          }/events/${event.id}`}
          passHref
        >
          <Link>
            <Typography>{event.title || event.activity.title}</Typography>
          </Link>
        </NextLink>
        <ZUINumberChip
          color={getParticipantsStatusColor(
            event.num_participants_required,
            event.num_participants_available
          )}
          outlined={true}
          size="sm"
          value={`${event.num_participants_available}/${event.num_participants_required}`}
        />
      </Box>
      <Typography color="secondary">
        <ZUITimeSpan
          end={new Date(event.end_time)}
          start={new Date(event.start_time)}
        />
      </Typography>
    </Box>
  );
};

export default RelatedEvent;
