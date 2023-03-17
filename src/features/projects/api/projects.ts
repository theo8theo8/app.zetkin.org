import { createUseQuery } from '../../../utils/api/resourceHookFactories';

import { ZetkinProject } from '../../../utils/types/zetkin';

export const projectsResource = (orgId: string) => {
  const key = ['projects', orgId];
  const url = `/orgs/${orgId}/projects`;

  return {
    useQuery: createUseQuery<ZetkinProject[]>(key, url),
  };
};

export const projectResource = (orgId: string, projectId: string) => {
  const key = ['project', projectId];
  const url = `/orgs/${orgId}/projects/${projectId}`;

  return {
    useQuery: createUseQuery<ZetkinProject>(key, url),
  };
};
