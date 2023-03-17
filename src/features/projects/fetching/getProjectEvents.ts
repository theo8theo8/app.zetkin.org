import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinEvent } from '../../../utils/types/zetkin';

export default function getProjectEvents(
  orgId: string,
  projectId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinEvent[]> => {
    const eventsRes = await fetch(
      `/orgs/${orgId}/projects/${projectId}/actions`
    );
    const eventsBody = await eventsRes.json();
    return eventsBody?.data;
  };
}
