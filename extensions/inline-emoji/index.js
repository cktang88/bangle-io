import '@bangle.dev/emoji/style.css';
import '@bangle.dev/react-emoji-suggest/style.css';
import './inline-emoji.css';

import { emojiSuggest } from '@bangle.dev/react-emoji-suggest';
import { Extension } from 'extension-helpers';

import { emoji, emojiMarkdownItPlugin } from '@bangle.dev/emoji/index';
import { EmojiSuggestComponent } from './EmojiSuggestComponent';
import { emojiSuggestKey, emojiSuggestMarkName, extensionName } from './config';

import { aliasEmojiPair, aliasToEmojiObj } from './emoji-data';

const getScrollContainer = (view) => {
  return view.dom.parentElement;
};

const maxItems = 500;

function getEmojis(queryText = '') {
  // let result = aliasLookup;
  let result = aliasEmojiPair
    .filter(([item]) => item.includes(queryText))
    .slice(0, maxItems);
  return [
    {
      name: undefined,
      emojis: result,
    },
  ];

  // if (result.length < 50) {
  // }

  // const resultIndexSet = new Set(result.map((r) => r[2]));

  // return Object.entries(categoryLookup)
  //   .map(([categoryName, eIndices]) => {
  //     const emo = eIndices
  //       .filter((eIndex) => resultIndexSet.has(eIndex))
  //       .flatMap((eIndex) =>
  //         aliasArray[eIndex].map((a) => [a, emojiArray[eIndex]]),
  //       );
  //     return [categoryName, emo];
  //   })
  //   .filter((r) => {
  //     return r[1].length > 0;
  //   })
  //   .map((r) => ({
  //     name: r[0],
  //     emojis: r[1],
  //   }));
}
const extension = Extension.create({
  name: extensionName,
  editorSpecs: [
    emoji.spec({ getEmoji: (alias) => aliasToEmojiObj[alias] }),
    emojiSuggest.spec({ markName: emojiSuggestMarkName }),
  ],
  editorPlugins: [
    emoji.plugins(),
    emojiSuggest.plugins({
      key: emojiSuggestKey,
      getEmojiGroups: (queryText) => {
        const result = getEmojis(queryText);
        return result;
      },
      markName: emojiSuggestMarkName,
      tooltipRenderOpts: {
        getScrollContainer,
        placement: 'bottom',
      },
    }),
  ],
  markdownItPlugins: [
    [
      emojiMarkdownItPlugin,
      {
        defs: aliasToEmojiObj,
      },
    ],
  ],
  EditorReactComponent: EmojiSuggestComponent,
});

export default extension;