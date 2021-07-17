import React from 'react';
import { Extension } from 'extension-registry';
import { CoreActionsHandler } from './CoreActionsHandler';
import {
  extensionName,
  TOGGLE_FILE_SIDEBAR_ACTION,
  TOGGLE_THEME_ACTION,
  NEW_NOTE_ACTION,
  NEW_WORKSPACE_ACTION,
  RENAME_ACTIVE_NOTE_ACTION,
  DELETE_ACTIVE_NOTE_ACTION,
  CLONE_WORKSPACE_ACTION,
} from './config';
import { NewNoteIcon } from 'ui-components';

const extension = Extension.create({
  name: extensionName,
  application: {
    actions: [
      { name: TOGGLE_THEME_ACTION, title: 'Toggle theme' },
      { name: TOGGLE_FILE_SIDEBAR_ACTION, title: 'Toggle file sidebar' },
      { name: NEW_NOTE_ACTION, title: 'New note' },
      { name: NEW_WORKSPACE_ACTION, title: 'New workspace' },
      { name: CLONE_WORKSPACE_ACTION, title: 'Clone current workspace' },
      { name: RENAME_ACTIVE_NOTE_ACTION, title: 'Rename active note' },
      { name: DELETE_ACTIVE_NOTE_ACTION, title: 'Delete active note' },
    ],
    optionsBar: [
      {
        icon: React.createElement(NewNoteIcon, {
          transform: 'scale(0.94, 0.94)',
        }),
        hint: 'New Note\n',
        action: NEW_NOTE_ACTION,
      },
    ],
    ReactComponent: CoreActionsHandler,
  },
});

export default extension;