import { useDrop } from 'react-dnd';
import { Box, useTheme } from '@mui/material';
import { createContext, FC } from 'react';
import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';

import ViewBrowserModel, {
  ViewBrowserItem,
} from 'features/views/models/ViewBrowserModel';

interface BrowserRowProps {
  item: ViewBrowserItem;
  model: ViewBrowserModel;
  rowProps: GridRowProps;
}

export interface BrowserRowDropProps {
  active: boolean;
}

export const BrowserRowContext = createContext<BrowserRowDropProps>({
  active: false,
});

/**
 * Row component for MUI X DataGrid, to be used in the ViewBrowser.
 * Adds support for dropping views/folders onto the row, highlighting
 * the row when dragging over, etc.
 */
const BrowserRow: FC<BrowserRowProps> = ({ item, model, rowProps }) => {
  const theme = useTheme();
  const [dropProps, dropRef] = useDrop<
    ViewBrowserItem,
    unknown,
    BrowserRowDropProps
  >({
    accept: 'ITEM',
    canDrop: (draggedItem) =>
      draggedItem.type == 'view' || draggedItem.id != item.id,
    collect: (monitor) => {
      return {
        active: monitor.isOver() && monitor.canDrop(),
      };
    },
    drop: (draggedItem) => {
      if (draggedItem.type == 'folder' || draggedItem.type == 'view') {
        const parentId = item.type == 'back' ? item.folderId : item.data.id;
        model.moveItem(draggedItem.type, draggedItem.data.id, parentId);
      }
    },
  });

  let content = <GridRow {...rowProps} />;

  if (item.type != 'view') {
    // If it's not a view, wrap it in a drop target
    content = (
      <Box
        ref={dropRef}
        style={{
          backgroundColor: dropProps.active
            ? theme.palette.background.paper
            : 'transparent',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <BrowserRowContext.Provider value={dropProps}>
      {content}
    </BrowserRowContext.Provider>
  );
};

export default BrowserRow;
