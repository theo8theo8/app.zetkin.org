import { Alert } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { Delete, Settings } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import deleteProject from 'features/projects/fetching/deleteProject';
import patchProject from 'features/projects/fetching/patchProject';
import ProjectDetailsForm from 'features/projects/components/ProjectDetailsForm';
import { ZetkinProject } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

enum PROJECT_MENU_ITEMS {
  EDIT_PROJECT = 'editProject',
  DELETE_PROJECT = 'deleteProject',
}

interface ProjectActionButtonsProps {
  project: ZetkinProject;
}

const ProjectActionButtons: React.FunctionComponent<
  ProjectActionButtonsProps
> = ({ project }) => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { orgId } = router.query;
  // Dialogs
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const closeDialog = () => setEditProjectDialogOpen(false);

  // Mutations
  const patchProjectMutation = useMutation(
    patchProject(orgId as string, project.id)
  );
  const deleteProjectMutation = useMutation(
    deleteProject(orgId as string, project.id)
  );

  // Event Handlers
  const handleEditProject = (project: Partial<ZetkinProject>) => {
    patchProjectMutation.mutate(project, {
      onSettled: () => queryClient.invalidateQueries(['project']),
      onSuccess: () => closeDialog(),
    });
  };
  const handleDeleteProject = () => {
    deleteProjectMutation.mutate(undefined, {
      onError: () => showSnackbar('error', messages.form.deleteProject.error()),
      onSuccess: () => {
        router.push(`/organize/${orgId as string}/projects`);
      },
    });
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <Link href={`/o/${orgId}/projects/${project.id}`} passHref>
          <Button color="primary">
            <Msg id={messageIds.linkGroup.public} />
          </Button>
        </Link>
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: PROJECT_MENU_ITEMS.EDIT_PROJECT,
              label: (
                <>
                  <Box mr={1}>
                    <Settings />
                  </Box>
                  <Msg id={messageIds.form.edit} />
                </>
              ),
              onSelect: () => setEditProjectDialogOpen(true),
            },
            {
              id: PROJECT_MENU_ITEMS.DELETE_PROJECT,
              label: (
                <>
                  <Box mr={1}>
                    <Delete />
                  </Box>
                  <Msg id={messageIds.form.deleteProject.title} />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDeleteProject,
                  title: messages.form.deleteProject.title(),
                  warningText: messages.form.deleteProject.warning(),
                });
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={closeDialog}
        open={editProjectDialogOpen}
        title={messages.form.edit()}
      >
        {patchProjectMutation.isError && (
          <Alert color="error" data-testid="error-alert">
            <Msg id={messageIds.form.requestError} />
          </Alert>
        )}
        <ProjectDetailsForm
          onCancel={closeDialog}
          onSubmit={handleEditProject}
          project={project}
        />
      </ZUIDialog>
    </Box>
  );
};

export default ProjectActionButtons;
