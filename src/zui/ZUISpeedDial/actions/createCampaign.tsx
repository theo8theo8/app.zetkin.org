import { Alert } from '@mui/material';
import { Flag } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import postProject from 'features/projects/fetching/postProject';
import ProjectDetailsForm from 'features/projects/components/ProjectDetailsForm';

import { ACTIONS } from '../constants';
import { Msg } from 'core/i18n';
import { ActionConfig, DialogContentBaseProps } from './types';

import messageIds from 'zui/l10n/messageIds';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({
  closeDialog,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const { mutateAsync: sendCampaignRequest, isError } = useMutation(
    postProject(orgId)
  );

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    await sendCampaignRequest(data, {
      onSuccess: async (newCampaign) => {
        queryClient.invalidateQueries('campaigns');
        closeDialog();
        // Redirect to campaign page
        router.push(`/organize/${orgId}/campaigns/${newCampaign.id}`);
      },
    });
  };

  return (
    <>
      {isError && (
        <Alert color="error" data-testid="error-alert">
          <Msg id={messageIds.speedDial.requestError} />
        </Alert>
      )}
      <ProjectDetailsForm onCancel={closeDialog} onSubmit={handleFormSubmit} />
    </>
  );
};

const config = {
  icon: <Flag />,
  key: ACTIONS.CREATE_PROJECT,
  name: 'misc.speedDial.createProject',
  urlKey: 'create-project',
} as ActionConfig;

export { config, DialogContent };
