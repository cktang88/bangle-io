import {} from '@bangle.io/baby-fs';
import { Extension } from '@bangle.io/extension-registry';
import {
  showNotification,
  uncaughtExceptionNotification,
} from '@bangle.io/slice-notification';
import { IndexedDbStorageError } from '@bangle.io/storage';

import {
  OPERATION_NEW_GITUB_WORKSPACE,
  OPERATION_UPDATE_GITHUB_TOKEN,
} from './common';
import { Router } from './components/Router';
import {
  ErrorCodesType,
  GITHUB_API_ERROR,
  INVALID_GITHUB_CONFIGURATION,
  INVALID_GITHUB_FILE_FORMAT,
  INVALID_GITHUB_RESPONSE,
  INVALID_GITHUB_TOKEN,
} from './errors';
import { GithubStorageProvider } from './github-storage-provider';

const extensionName = '@bangle.io/github-storage';

const extension = Extension.create({
  name: extensionName,
  application: {
    ReactComponent: Router,
    slices: [],
    storageProvider: new GithubStorageProvider(),
    onStorageError: (error, store) => {
      const errorCode = error.code as ErrorCodesType;
      switch (errorCode) {
        case GITHUB_API_ERROR: {
          if (error.message.includes('Bad credentials')) {
            showNotification({
              severity: 'error',
              title: 'Bad Github credentials',
              content:
                'Please check your Github token has correct permissions and try again.',
              uid: `github-storage-error-${errorCode}`,
              buttons: [
                {
                  title: 'Update token',
                  hint: `Update your Github token`,
                  operation: OPERATION_UPDATE_GITHUB_TOKEN,
                },
              ],
            })(store.state, store.dispatch);

            break;
          }
          showNotification({
            severity: 'error',
            title: error.message,
            uid: `github-storage-error-${errorCode}`,
          })(store.state, store.dispatch);
          break;
        }
        case INVALID_GITHUB_FILE_FORMAT: {
          showNotification({
            severity: 'error',
            title: error.message,
            uid: `github-file-format`,
          })(store.state, store.dispatch);
          break;
        }
        case INVALID_GITHUB_TOKEN: {
          showNotification({
            severity: 'error',
            title: 'Github token is invalid',
            uid: 'Invalid github token',
          })(store.state, store.dispatch);
          break;
        }

        case INVALID_GITHUB_CONFIGURATION: {
          showNotification({
            severity: 'error',
            title: 'Invalid github workspace configuration',
            uid: INVALID_GITHUB_CONFIGURATION,
          })(store.state, store.dispatch);
          break;
        }

        case INVALID_GITHUB_RESPONSE: {
          showNotification({
            severity: 'error',
            title: 'Received invalid response from Github',
            uid: INVALID_GITHUB_RESPONSE,
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.VALIDATION_ERROR: {
          showNotification({
            severity: 'error',
            title: 'Invalid data',
            uid: 'VALIDATION_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.FILE_NOT_FOUND_ERROR: {
          showNotification({
            severity: 'error',
            title: 'File not found',
            uid: 'FILE_NOT_FOUND_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.UPSTREAM_ERROR: {
          console.error(error);
          showNotification({
            severity: 'error',
            title: 'upstream error',
            uid: 'UPSTREAM_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.FILE_ALREADY_EXISTS_ERROR: {
          showNotification({
            severity: 'error',
            title: 'File already exists',
            uid: 'FILE_ALREADY_EXISTS_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.NOT_ALLOWED_ERROR: {
          showNotification({
            severity: 'error',
            title: 'Not allowed',
            uid: 'NOT_ALLOWED_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        case IndexedDbStorageError.NOT_A_DIRECTORY_ERROR: {
          showNotification({
            severity: 'error',
            title: 'NOT_A_DIRECTORY_ERROR',
            uid: 'NOT_A_DIRECTORY_ERROR',
          })(store.state, store.dispatch);
          break;
        }

        default: {
          // hack to catch switch slipping
          let val: never = errorCode;

          console.error(error);
          uncaughtExceptionNotification(error)(store.state, store.dispatch);

          return false;
        }
      }

      return true;
    },
    operations: [
      {
        name: OPERATION_NEW_GITUB_WORKSPACE,
        title: 'Github: New workspace',
      },
      {
        name: OPERATION_UPDATE_GITHUB_TOKEN,
        title: 'Github: Update personal access token',
      },
    ],
    operationHandler() {
      return {
        handle(operation, payload, store) {
          switch (operation.name) {
            default: {
              return false;
            }
          }
        },
      };
    },
  },
});

export default extension;

// let r = await fetch('https://api.github.com/graphql', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `bearer ${token}`,
//   },
//   body: JSON.stringify({
//     query: `
//     query {
//       repository(owner: "octocat", name: "Hello-World") {
//         issues(last: 20, states: CLOSED) {
//           edges {
//             node {
//               title
//               url
//               labels(first: 5) {
//                 edges {
//                   node {
//                     name
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//     `,
//     variables: {},
//   }),
// });
