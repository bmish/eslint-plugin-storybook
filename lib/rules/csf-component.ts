/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */

import { ExportDefaultDeclaration } from '@typescript-eslint/types/dist/ast-spec'
import { getMetaObjectExpression } from '../utils'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { isSpreadElement } from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'csf-component',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'The component property should be set',
      categories: [CategoryId.CSF],
      recommended: 'warn',
    },
    messages: {
      missingComponentProperty: 'Missing component property.',
    },
    schema: [],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        const meta = getMetaObjectExpression(node, context)

        if (!meta) {
          return null
        }

        const componentProperty = meta.properties.find(
          (property) =>
            !isSpreadElement(property) &&
            'name' in property.key &&
            property.key.name === 'component'
        )

        if (!componentProperty) {
          context.report({
            node,
            messageId: 'missingComponentProperty',
          })
        }
      },
    }
  },
})
