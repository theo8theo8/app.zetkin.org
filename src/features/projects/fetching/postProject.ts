import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinProject } from '../../../utils/types/zetkin';

export default function postProject(orgId: string, fetch = defaultFetch) {
  return async (project: Record<string, unknown>): Promise<ZetkinProject> => {
    const url = `/orgs/${orgId}/projects`;
    const res = await fetch(url, {
      body: JSON.stringify(project),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error(`Error making POST request to ${url}`);
    }

    const resData = await res.json();
    return resData?.data;
  };
}
