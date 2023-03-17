import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';

import ProjectBrowserModel from '../models/CampaignBrowserModel';
import useModel from 'core/useModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

const ProjectsActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = router.query;
  const model = useModel(
    (env) => new ProjectBrowserModel(env, parseInt(orgId as string))
  );

  // Event Handlers
  const handleCreateProject = () => {
    const project = {
      title: messages.form.createProject.newProject(),
    };
    model.createProject(project);
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          onClick={handleCreateProject}
          variant="contained"
        >
          <Msg id={messageIds.all.create} />
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectsActionButtons;
