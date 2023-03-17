import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import patchProject from '../fetching/patchProject';
import { useMessages } from 'core/i18n';
import { ZetkinProject } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

import messageIds from '../l10n/messageIds';

interface EditableProjectTitleProps {
  project: ZetkinProject;
}

const EditableProjectTitle: FC<EditableProjectTitleProps> = ({ project }) => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();
  const { orgId } = useRouter().query;

  const { showSnackbar } = useContext(ZUISnackbarContext);

  const patchProjectMutation = useMutation(
    patchProject(orgId as string, project.id)
  );

  const handleEditProjectTitle = (newTitle: string) => {
    patchProjectMutation.mutate(
      { title: newTitle },
      {
        onError: () =>
          showSnackbar('error', messages.form.editProjectTitle.error()),
        onSettled: () => queryClient.invalidateQueries(['project']),
        onSuccess: () =>
          showSnackbar('success', messages.form.editProjectTitle.success()),
      }
    );
  };

  return (
    <Box>
      <ZUIEditTextinPlace
        key={project.id}
        onChange={(newTitle) => {
          handleEditProjectTitle(newTitle);
        }}
        value={project?.title}
      />
    </Box>
  );
};

export default EditableProjectTitle;
