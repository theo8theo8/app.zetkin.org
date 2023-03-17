import { GetServerSideProps } from 'next';
import Head from 'next/head';

import Calendar from 'features/calendar/components';
import getOrg from 'utils/fetching/getOrg';
import getProject from 'features/projects/fetching/getProject';
import getProjectEvents from 'features/projects/fetching/getProjectEvents';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleProjectLayout from 'features/projects/layout/SingleCampaignLayout';
import { useQuery } from 'react-query';
import ZUISpeedDial, { ACTIONS } from 'zui/ZUISpeedDial';

import { campaignTasksResource } from 'features/tasks/api/tasks';
import { useMessages } from 'core/i18n';

import messageIds from 'features/projects/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'misc.calendar',
    'misc.formDialog',
    'misc.speedDial',
    'misc.tasks',
    'pages.organizeCampaigns',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId } = ctx.params!;

  const { prefetch: prefetchCampaignTasks } = campaignTasksResource(
    orgId as string,
    campId as string
  );
  const { state: campaignTasksState } = await prefetchCampaignTasks(ctx);

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['campaignEvents', orgId, campId],
    getProjectEvents(orgId as string, campId as string, ctx.apiFetch)
  );
  const campaignEventsState = ctx.queryClient.getQueryState([
    'campaignEvents',
    orgId,
    campId,
  ]);

  await ctx.queryClient.prefetchQuery(
    ['campaign', orgId, campId],
    getProject(orgId as string, campId as string, ctx.apiFetch)
  );
  const campaignState = ctx.queryClient.getQueryState([
    'campaign',
    orgId,
    campId,
  ]);

  if (
    orgState?.status === 'success' &&
    campaignEventsState?.status === 'success' &&
    campaignState?.status === 'success' &&
    campaignTasksState?.status === 'success'
  ) {
    return {
      props: {
        campId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type OrganizeCalendarPageProps = {
  campId: string;
  orgId: string;
};

const CampaignCalendarPage: PageWithLayout<OrganizeCalendarPageProps> = ({
  orgId,
  campId,
}) => {
  const messages = useMessages(messageIds);
  const eventsQuery = useQuery(
    ['campaignEvents', orgId, campId],
    getProjectEvents(orgId, campId)
  );
  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getProject(orgId, campId)
  );
  const tasksQuery = campaignTasksResource(orgId, campId).useQuery();

  const events = eventsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const campaigns = campaignQuery.data ? [campaignQuery.data] : [];

  return (
    <>
      <Head>
        <title>
          {`${campaignQuery.data?.title} - ${messages.layout.calendar()}`}
        </title>
      </Head>
      <Calendar
        baseHref={`/organize/${orgId}/campaigns/${campId}/calendar`}
        campaigns={campaigns}
        events={events}
        tasks={tasks}
      />
      <ZUISpeedDial actions={[ACTIONS.CREATE_TASK]} />
    </>
  );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
  return <SingleProjectLayout fixedHeight>{page}</SingleProjectLayout>;
};

export default CampaignCalendarPage;
