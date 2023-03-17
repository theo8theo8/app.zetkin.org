import { Store } from '@reduxjs/toolkit';

import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { campaignCreate, campaignCreated } from '../store';
import { ZetkinProject, ZetkinProjectPostBody } from 'utils/types/zetkin';

export default class CampaignsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  async createProject(
    projectBody: ZetkinProjectPostBody,
    orgId: number
  ): Promise<ZetkinProject> {
    this._store.dispatch(campaignCreate());
    const project = await this._apiClient.post<
      ZetkinProject,
      ZetkinProjectPostBody
    >(`/api/orgs/${orgId}/campaigns`, projectBody);

    this._store.dispatch(campaignCreated(project));
    return project;
  }
}
