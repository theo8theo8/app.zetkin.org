import { FormattedDate } from 'react-intl';
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import EditableProjectTitle from '../components/EditableProjectTitle';
import getProject from 'features/projects/fetching/getProject';
import getProjectEvents from '../fetching/getProjectEvents';
import ProjectActionButtons from 'features/projects/components/ProjectActionButtons';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface SingleProjectLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SingleProjectLayout: FunctionComponent<SingleProjectLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const { projectId, orgId } = useRouter().query;
  const projectQuery = useQuery(
    ['project', orgId, projectId],
    getProject(orgId as string, projectId as string)
  );
  const projectEventsQuery = useQuery(
    ['projectEvents', orgId, projectId],
    getProjectEvents(orgId as string, projectId as string)
  );

  const project = projectQuery.data;
  const projectEvents = projectEventsQuery.data || [];

  const [firstEvent, lastEvent] = getFirstAndLastEvent(projectEvents);

  if (!project) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<ProjectActionButtons project={project} />}
      baseHref={`/organize/${orgId}/projects/${projectId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={
        firstEvent && lastEvent ? (
          <>
            <FormattedDate
              day="2-digit"
              month="long"
              value={removeOffset(firstEvent.start_time)}
            />
            {` - `}
            <FormattedDate
              day="2-digit"
              month="long"
              value={removeOffset(lastEvent.end_time)}
              year="numeric"
            />
          </>
        ) : (
          <Msg id={messageIds.indefinite} />
        )
      }
      tabs={[
        { href: `/`, label: messages.layout.summary() },
        {
          href: `/calendar`,
          label: messages.layout.calendar(),
        },
      ]}
      title={<EditableProjectTitle project={project} />}
    >
      {children}
    </TabbedLayout>
  );
};

export default SingleProjectLayout;
