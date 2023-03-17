import CampaignsRepo from '../repos/CampaignsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { ZetkinProject, ZetkinProjectPostBody } from 'utils/types/zetkin';

export default class ProjectBrowserModel extends ModelBase {
  private _env: Environment;
  private _orgId: number;
  private _repo: CampaignsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._repo = new CampaignsRepo(this._env);
  }

  createProject(projectBody: ZetkinProjectPostBody): IFuture<ZetkinProject> {
    const promise = this._repo
      .createProject(projectBody, this._orgId)
      .then((project: ZetkinProject) => {
        this._env.router.push(
          `/organize/${project.organization?.id}/projects/${project.id}`
        );
        return project;
      });
    return new PromiseFuture(promise);
  }
}
