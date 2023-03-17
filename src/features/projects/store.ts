import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinProject } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface CampaignsStoreSlice {
  recentlyCreatedCampaign: ZetkinProject | null;
  campaignList: RemoteList<ZetkinProject>;
}

const initialState: CampaignsStoreSlice = {
  campaignList: remoteList(),
  recentlyCreatedCampaign: null,
};

const campaignsSlice = createSlice({
  initialState,
  name: 'campaigns',
  reducers: {
    campaignCreate: (state) => {
      state.campaignList.isLoading = true;
      state.recentlyCreatedCampaign = null;
    },
    campaignCreated: (state, action: PayloadAction<ZetkinProject>) => {
      const campaign = action.payload;
      state.campaignList.isLoading = false;
      state.campaignList.items.push(
        remoteItem(campaign.id, { data: campaign })
      );
      state.recentlyCreatedCampaign = campaign;
    },
  },
});

export default campaignsSlice;
export const { campaignCreate, campaignCreated } = campaignsSlice.actions;
