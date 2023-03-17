import defaultFetch from '../../../utils/fetching/defaultFetch';

const deleteProject = (
  orgId: string | number,
  projectId: string | number,
  fetch = defaultFetch
) => {
  return async (): Promise<void> => {
    const url = `/orgs/${orgId}/projects/${projectId}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Error making PATCH request to ${url}`);
    }
  };
};

export default deleteProject;
