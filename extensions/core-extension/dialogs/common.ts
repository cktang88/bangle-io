import { supportsNativeBrowserFs } from '@bangle.io/baby-fs';

export enum StorageType {
  NATIVE_FS = 'NATIVE_FS',
  BROWSER = 'BROWSER',
  GITHUB = 'GITHUB',
}

export let disabledStorageType: StorageType[] = [];

export let defaultStorage = StorageType.NATIVE_FS;

if (!supportsNativeBrowserFs()) {
  disabledStorageType.push(StorageType.NATIVE_FS);
  defaultStorage = StorageType.BROWSER;
}

export const FILE_SYSTEM = StorageType.NATIVE_FS;
export const BROWSER = StorageType.BROWSER;

export const ERROR_PICKING_DIRECTORY_ERROR = 'ERROR_PICKING_DIRECTORY';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const INVALID_WORKSPACE_NAME_ERROR = 'INVALID_WORKSPACE_NAME';
export const WORKSPACE_AUTH_REJECTED_ERROR = 'WORKSPACE_AUTH_REJECTED';
// this happens when the chrome just rejects by saying user activation needed
export const CLICKED_TOO_SOON_ERROR = 'CLICKED_TOO_SOON_ERROR';
export const WORKSPACE_NAME_ALREADY_EXISTS_ERROR =
  'WORKSPACE_NAME_ALREADY_EXISTS';

export type WorkspaceCreateErrorTypes =
  | typeof ERROR_PICKING_DIRECTORY_ERROR
  | typeof INVALID_WORKSPACE_NAME_ERROR
  | typeof WORKSPACE_AUTH_REJECTED_ERROR
  | typeof WORKSPACE_NAME_ALREADY_EXISTS_ERROR
  | typeof CLICKED_TOO_SOON_ERROR
  | typeof UNKNOWN_ERROR;

export const BROWSE_BUTTON_ID = 'new-workspace-modal_browse-button';