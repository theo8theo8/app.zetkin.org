import defaultFetch from '../../../utils/fetching/defaultFetch';
import { generateRandomColor } from '../../../utils/colorUtils';
import { ZetkinProject } from '../../../utils/types/zetkin';

export default function getCampaign(
  orgId: string,
  campId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinProject> => {
    const cIdRes = await fetch(`/orgs/${orgId}/campaigns/${campId}`);
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
