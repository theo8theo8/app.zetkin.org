import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinProject } from 'utils/types/zetkin';

export default function patchProject(
  orgId: string | number,
  projectId: string | number,
  fetch = defaultFetch
) {
  return async (project: Record<string, unknown>): Promise<ZetkinProject> => {
    const url = `/orgs/${orgId}/projects/${projectId}`;
    const res = await fetch(url, {
      body: JSON.stringify(project),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error(`Error making PATCH request to ${url}`);
    }
    const resData = await res.json();
    return resData;
  };
}
