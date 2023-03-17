import defaultFetch from '../../../utils/fetching/defaultFetch';
import { generateRandomColor } from '../../../utils/colorUtils';
import { ZetkinProject } from '../../../utils/types/zetkin';

export default function getProject(
  orgId: string,
  projectId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinProject> => {
    const cIdRes = await fetch(`/orgs/${orgId}/projects/${projectId}`);
    const cIdData = await cIdRes.json();
    const dataWithColor = {
      ...cIdData,
      data: {
        ...cIdData.data,
        color: generateRandomColor(cIdData.data.id.toString()),
      },
    };
    return dataWithColor.data;
  };
}
