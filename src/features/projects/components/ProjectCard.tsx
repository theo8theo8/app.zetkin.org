import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from '@mui/material';

import { Msg } from 'core/i18n';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { ZetkinEvent, ZetkinProject } from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';

interface ProjectCardProps {
  project: ZetkinProject;
  events: ZetkinEvent[];
}

const ProjectCard = ({ project, events }: ProjectCardProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { id, title } = project;

  const projectEvents = events.filter(
    (event) => event.project.id === project.id
  );
  const numOfUpcomingEvents = projectEvents.filter((event) =>
    dayjs(removeOffset(event.end_time)).isAfter(dayjs())
  ).length;

  const [firstEvent, lastEvent] = getFirstAndLastEvent(projectEvents);

  return (
    <Card data-testid="project-card">
      <CardContent>
        <Typography gutterBottom noWrap variant="h6">
          {title}
        </Typography>
        <Typography gutterBottom variant="body2">
          {firstEvent && lastEvent ? (
            <>
              <FormattedDate
                day="numeric"
                month="long"
                value={removeOffset(firstEvent.start_time)}
              />{' '}
              {' - '}
              <FormattedDate
                day="numeric"
                month="long"
                value={removeOffset(lastEvent.end_time)}
              />
            </>
          ) : (
            <Msg id={messageIds.indefinite} />
          )}
        </Typography>
        <Typography color="secondary" gutterBottom variant="body2">
          <Msg
            id={messageIds.all.upcoming}
            values={{ numEvents: numOfUpcomingEvents }}
          />
        </Typography>
        {/*TODO: labels for calls and surveys*/}
      </CardContent>
      <CardActions>
        <NextLink href={`/organize/${orgId}/projects/${id}`} passHref>
          <Link underline="hover" variant="button">
            <Msg id={messageIds.all.cardCTP} />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
