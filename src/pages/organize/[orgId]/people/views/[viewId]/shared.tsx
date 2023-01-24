import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';

import BackendApiClient from 'core/api/client/BackendApiClient';
import getOrg from 'utils/fetching/getOrg';
import getView from 'features/views/fetching/getView';
import getViewColumns from 'features/views/fetching/getViewColumns';
import getViewRows from 'features/views/fetching/getViewRows';
import IApiClient from 'core/api/client/IApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedViewLayout from 'features/views/layout/SharedViewLayout';
import ViewDataTable from 'features/views/components/ViewDataTable';
import { ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinObjectAccess } from 'core/api/types';
import ZUIQuery from 'zui/ZUIQuery';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.views'],
};

async function getAccessLevel(
  apiClient: IApiClient,
  orgId: number,
  viewId: number
): Promise<ZetkinObjectAccess['level'] | null> {
  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );
  const myMembership = memberships.find((mem) => mem.organization.id == orgId);

  if (!myMembership) {
    // NOTE: Might be superuser
    return null;
  }

  const isOfficial = Boolean(myMembership.role);
  if (isOfficial) {
    return 'configure';
  }

  const accessList = await apiClient.get<ZetkinObjectAccess[]>(
    `/api/orgs/${orgId}/people/views/${viewId}/access`
  );
  const accessObject = accessList.find(
    (obj) => obj.person.id == myMembership.profile.id
  );

  return accessObject?.level ?? null;
}

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  // TODO: Handle this some other way with server-side models?
  const apiClient = new BackendApiClient(ctx.req.headers);
  const accessLevel = await getAccessLevel(
    apiClient,
    parseInt(orgId as string),
    parseInt(viewId as string)
  );

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['view', viewId],
    getView(orgId as string, viewId as string, ctx.apiFetch)
  );

  const viewState = ctx.queryClient.getQueryState(['view', viewId]);

  if (orgState?.data && viewState?.data) {
    return {
      props: {
        accessLevel,
        orgId,
        viewId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type SharedViewPageProps = {
  accessLevel: ZetkinObjectAccess['level'];
  orgId: string;
  viewId: string;
};

const SharedViewPage: PageWithLayout<SharedViewPageProps> = ({
  accessLevel,
  orgId,
  viewId,
}) => {
  const canConfigure = accessLevel == 'configure';

  return (
    <ZUIQuery
      queries={{
        colsQuery: useQuery(
          ['view', viewId, 'columns'],
          getViewColumns(orgId, viewId)
        ),
        rowsQuery: useQuery(
          ['view', viewId, 'rows'],
          getViewRows(orgId, viewId)
        ),
        viewQuery: useQuery(['view', viewId], getView(orgId, viewId)),
      }}
    >
      {({ queries: { colsQuery, rowsQuery, viewQuery } }) => (
        <>
          <Head>
            <title>{viewQuery.data.title}</title>
          </Head>
          <ViewDataTable
            columns={colsQuery.data}
            disableBulkActions
            disableConfigure={!canConfigure}
            rows={rowsQuery.data}
            view={viewQuery.data}
          />
        </>
      )}
    </ZUIQuery>
  );
};

SharedViewPage.getLayout = function getLayout(page) {
  return <SharedViewLayout>{page}</SharedViewLayout>;
};

export default SharedViewPage;
