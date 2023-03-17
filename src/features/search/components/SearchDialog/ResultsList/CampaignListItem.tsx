import { Event } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinProject } from 'utils/types/zetkin';

import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

const CampaignListItem: React.FunctionComponent<{
  campaign: ZetkinProject;
}> = ({ campaign }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={campaign.id}
      href={`/organize/${orgId}/campaigns/${campaign.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <Event />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={campaign.title}
          secondary={<Msg id={messageIds.results.project} />}
        />
      </ListItem>
    </Link>
  );
};

export default CampaignListItem;
