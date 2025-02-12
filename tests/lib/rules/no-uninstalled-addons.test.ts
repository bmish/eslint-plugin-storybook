/**
 * @fileoverview This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.
 * @author Andre "andrelas1" Santos
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils'

import rule from '../../../lib/rules/no-uninstalled-addons'
import ruleTester from '../../utils/rule-tester'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: () => `
    {
      "devDependencies": {
        "@storybook/addon-essentials": "^6.5.9",
        "@storybook/addon-interactions": "^6.5.9",
        "@storybook/preset-create-react-app": "^6.5.9",
        "@storybook/addon-links": "^6.5.9",
        "storybook-addon-valid-addon": "0.0.1",
        "addon-without-the-prefix": "^0.0.1"
      }
    }
  `,
}))

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-uninstalled-addons', rule, {
  valid: [
    `
    export default {
      addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-create-react-app"
      ]
    }
  `,
    `
    export const addons = [
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@storybook/addon-interactions",
    ]
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "storybook-addon-valid-addon/register",
          "addon-without-the-prefix/preset",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "storybook-addon-valid-addon",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-without-the-prefix",
        ]
      }
  `,
    `
      module.exports = {
          addons: [
            "../my-local-addon",
            "../my-local-addon/index.cjs",
            "/Users/foo/my-local-addon/index.js",
            "/mount/foo/my-local-addon/index.js",
            "C:\\Users\\foo\\my-local-addon/index.js",
            "D:\\Users\\foo\\my-local-addon/index.js",
          ]
        }
    `,
    `
    module.exports = {
        addons: [
          {
            name: "@storybook/addon-links",
          },
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          {
            name: "addon-without-the-prefix",
          },
          {
            name: "storybook-addon-valid-addon/register.js",
          },
        ]
      }
  `,
  ],
  invalid: [
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          '@storybook/not-installed-addon'
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          // type: AST_NODE_TYPES.AssignmentExpression,
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/not-installed-addon',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          {
            name: '@storybook/not-installed-addon'
          }
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/not-installed-addon',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          {
            name: "@storybook/addon-esentials",
          },
          "@storybook/addon-interactions",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/adon-essentials",
          "@storybook/addon-interactions",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/adon-essentials',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
      export default {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
    {
      code: `
        export const addons = [
          "../my-local-addon",
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
            packageJsonPath: 'eslint-plugin-storybook/',
          },
        },
      ],
    },
  ],
})
