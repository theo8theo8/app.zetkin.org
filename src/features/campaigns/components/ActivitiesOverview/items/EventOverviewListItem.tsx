import { FC } from 'react';
import {
  EventOutlined,
  People,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import EventDataModel from 'features/events/models/EventDataModel';
import EventWarningIcons from 'features/events/components/EventWarningIcons';
import OverviewListItem from './OverviewListItem';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface EventOverviewListItemProps {
  event: ZetkinEvent;
  focusDate: Date | null;
}

const EventOverviewListItem: FC<EventOverviewListItemProps> = ({
  event,
  focusDate,
}) => {
  const model = useModel(
    (env) => new EventDataModel(env, event.organization.id, event.id)
  );

  return (
    <OverviewListItem
      endDate={null}
      endNumber={`${event.num_participants_available} / ${event.num_participants_required}`}
      endNumberColor={
        event.num_participants_available < event.num_participants_required
          ? 'error'
          : undefined
      }
      focusDate={focusDate}
      href={`/organize/${event.organization.id}/projects/${
        event.campaign?.id ?? 'standalone'
      }/events/${event.id}`}
      meta={<EventWarningIcons compact model={model} />}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={People}
      startDate={null}
      statusBar={null}
      subtitle={
        <ZUIIconLabelRow
          iconLabels={[
            {
              icon: <ScheduleOutlined fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(event.end_time)}
                  start={new Date(event.start_time)}
                />
              ),
            },
            ...(event.location
              ? [
                  {
                    icon: <PlaceOutlined fontSize="inherit" />,
                    label: event.location.title,
                  },
                ]
              : []),
          ]}
        />
      }
      title={event.title || event.activity.title}
    />
  );
};

export default EventOverviewListItem;
