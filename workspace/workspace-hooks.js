import { useHistory, matchPath, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Node } from '@bangle.dev/core/prosemirror/model';
import { specRegistry } from 'editor/index';

import { locationToFilePath, resolvePath } from './path-helpers';
import {
  createWorkspace,
  deleteWorkspace,
  listWorkspaces,
} from './workspace-helpers';
import { cachedListAllFiles, createFile, deleteFile } from './file-helpers';
import { checkWidescreen } from 'utils/index';
import { importGithubWorkspace } from './github-helpers';
const LOG = false;
let log = LOG ? console.log.bind(console, 'workspace/index') : () => {};

export function useGetCachedWorkspaceFiles() {
  const { wsName } = useWorkspacePath();
  const location = useLocation();
  const [files, setFiles] = useState(undefined);
  const isDestroyed = useRef(false);

  const refreshFiles = useCallback(() => {
    if (wsName) {
      // TODO this is called like a million times
      // we need to fix this to only update based on known things
      // like renaming of file, delete etc.
      cachedListAllFiles(wsName)
        .then((items) => {
          if (!isDestroyed.current) {
            setFiles(items);
          }
        })
        .catch((error) => {
          if (!isDestroyed.current) {
            setFiles(undefined);
          }
          throw error;
        });
    }
  }, [wsName]);

  useEffect(() => {
    refreshFiles();
    // workspaceStatus is added here so that if permission
    // changes the files can be updated
  }, [refreshFiles, location.state?.workspaceStatus]);

  useEffect(() => {
    return () => {
      isDestroyed.current = true;
    };
  }, []);

  return [files, refreshFiles];
}

export function useCreateMdFile() {
  const { pushWsPath } = useWorkspacePath();

  const createNewMdFile = useCallback(
    async (
      wsPath,
      doc = Node.fromJSON(specRegistry.schema, {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: {
              level: 1,
            },
            content: [
              {
                type: 'text',
                text: resolvePath(wsPath).fileName,
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello world!',
              },
            ],
          },
        ],
      }),
    ) => {
      await createFile(wsPath, doc);
      pushWsPath(wsPath);
    },
    [pushWsPath],
  );

  return createNewMdFile;
}

export function useDeleteFile() {
  const { wsName, wsPath } = useWorkspacePath();
  const history = useHistory();

  const deleteByWsPath = useCallback(
    async (wsPathToDelete) => {
      await deleteFile(wsPathToDelete);
      if (wsPathToDelete === wsPath) {
        history.replace('/ws/' + wsName);
      }
    },
    [wsName, wsPath, history],
  );

  return deleteByWsPath;
}

export function useWorkspaces() {
  const [workspaces, updateWorkspaces] = useState([]);
  const { wsName } = useWorkspacePath();
  const history = useHistory();
  const isDestroyed = useRef(false);

  const refreshWorkspaces = useCallback(() => {
    listWorkspaces().then((workspaces) => {
      if (!isDestroyed.current) {
        updateWorkspaces(workspaces);
      }
    });
  }, []);

  useEffect(() => {
    refreshWorkspaces();
    return () => {
      isDestroyed.current = true;
    };
  }, [refreshWorkspaces]);

  const createWorkspaceCb = useCallback(
    async (wsName, type, opts) => {
      await createWorkspace(wsName, type, opts);
      history.push(`/ws/${wsName}`);
    },
    [history],
  );

  const importWorkspaceFromGithubCb = useCallback(
    // can pass alternate wsName in the options
    async (url, wsType, opts = {}) => {
      const wsName = await importGithubWorkspace(
        url,
        wsType,
        opts.wsName,
        opts.token,
      );

      await refreshWorkspaces();
      history.push(`/ws/${wsName}`);
    },
    [history, refreshWorkspaces],
  );

  const deleteWorkspaceCb = useCallback(
    async (targetWsName) => {
      await deleteWorkspace(targetWsName);
      if (targetWsName === wsName) {
        history.push(`/ws/`);
      } else {
        refreshWorkspaces();
      }
    },
    [history, wsName, refreshWorkspaces],
  );

  const switchWorkspaceCb = useCallback(
    async (wsName, newTab) => {
      const newPath = '/ws/' + wsName;
      if (newTab) {
        window.open(newPath);
        return;
      }
      history.push(newPath);
    },
    [history],
  );

  return {
    workspaces,
    createWorkspace: createWorkspaceCb,
    deleteWorkspace: deleteWorkspaceCb,
    switchWorkspace: switchWorkspaceCb,
    importWorkspaceFromGithub: importWorkspaceFromGithubCb,
  };
}

export function useWorkspacePath() {
  const location = useLocation();
  const match = matchPath(location.pathname, {
    path: '/ws/:wsName',
    exact: false,
    strict: false,
  });

  const { wsName } = match?.params ?? {};
  const { secondaryWsPath } = location?.state ?? {};
  let wsPath;

  const filePath = locationToFilePath(location);
  if (filePath) {
    wsPath = wsName + ':' + filePath;
  }

  const history = useHistory();

  const pushWsPath = useCallback(
    (wsPath, newTab = false, secondary = false) => {
      const { wsName, filePath } = resolvePath(wsPath);
      const newPath = `/ws/${wsName}/${filePath}`;
      if (newTab) {
        window.open(newPath);
        return;
      }

      const isWidescreen = checkWidescreen();

      if (isWidescreen && secondary) {
        // replace is intentional as native history pop
        // for some reason isnt remembering the state.
        history.replace(history.location.pathname, {
          ...history.location?.state,
          secondaryWsPath: wsPath,
        });
        return;
      }

      if (newPath === history.location.pathname) {
        return;
      }

      history.push(newPath, {
        ...history.location?.state,
        secondaryWsPath: isWidescreen ? secondaryWsPath : null,
      });
    },
    [history, secondaryWsPath],
  );

  const replaceWsPath = useCallback(
    (wsPath) => {
      const { wsName, filePath } = resolvePath(wsPath);
      log('replaceWsPath', wsPath);

      history.replace({
        ...history.location,
        pathname: `/ws/${wsName}/${filePath}`,
      });
    },
    [history],
  );

  // removes the currently active wsPath
  const removeWsPath = useCallback(() => {
    if (!wsPath) {
      return;
    }

    let newPath = null;

    // transition any secondary to main
    if (secondaryWsPath) {
      const { wsName, filePath } = resolvePath(secondaryWsPath);
      newPath = `/ws/${wsName}/${filePath}`;
    } else {
      newPath = `/ws/${wsName}`;
    }

    history.push(newPath, {
      ...history.location?.state,
      secondaryWsPath: null,
    });
  }, [history, wsPath, wsName, secondaryWsPath]);

  // the editor on side
  const removeSecondaryWsPath = useCallback(() => {
    log('removeSecondaryWsPath');
    history.replace(history.location.pathname, {
      ...history.location?.state,
      secondaryWsPath: null,
    });
  }, [history]);

  // TODO should I add more safeguard for
  // workspacePerm.type == ready?
  if (!wsName) {
    return {
      wsName,
      wsPath: null,
      secondaryWsPath: null,
      filePath: null,
      pushWsPath,
      replaceWsPath,
      removeSecondaryWsPath,
      removeWsPath,
    };
  }

  return {
    wsName,
    wsPath,
    secondaryWsPath,
    filePath,
    pushWsPath,
    replaceWsPath,
    removeWsPath,
    removeSecondaryWsPath,
  };
}