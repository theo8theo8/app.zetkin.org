import defaultFetch from '../../../utils/fetching/defaultFetch';
import { generateRandomColor } from '../../../utils/colorUtils';
import { ZetkinProject } from '../../../utils/types/zetkin';

export default function getCampaigns(orgId: string, fetch = defaultFetch) {
  return async (): Promise<ZetkinProject[]> => {
    const cRes = await fetch(`/orgs/${orgId}/campaigns`);
    const cData = await cRes.json();
    const dataWithColor = {
      ...cData,
      data: cData.data.map((c: ZetkinProject) => {
        return { ...c, color: generateRandomColor(c.id.toString()) };
      }),
    };
    return dataWithColor.data;
  };
}
