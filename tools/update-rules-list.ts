import rules from './utils/rules'

import { emojiKey, writeRulesListInReadme, updateRulesDocs } from './utils/docs'

/*
This script updates the rules table in `README.md`from rule's meta data.
*/

export type TRulesList = readonly [
  ruleName: string,
  ruleLink: string,
  docsDescription: string,
  fixable: string,
  categories: string
]
export type TRuleListWithoutName = TRulesList extends readonly [string, ...infer TRulesWithoutName]
  ? TRulesWithoutName
  : never

const createRuleLink = (ruleName: string) =>
  `[\`storybook/${ruleName}\`](./docs/rules/${ruleName}.md)`

const rulesList: TRulesList[] = Object.entries(rules)
  .sort(([_, { name: ruleNameA }], [__, { name: ruleNameB }]) => {
    return ruleNameA.localeCompare(ruleNameB)
  })
  .map(([_, rule]) => {
    return [
      rule.name,
      createRuleLink(rule.name),
      rule.meta.docs.description,
      rule.meta.fixable ? emojiKey.fixable : '',
      `<ul>${rule.meta.docs.categories.map((c) => `<li>${c}</li>`).join('')}</ul>`,
    ]
  })

writeRulesListInReadme(rulesList)

updateRulesDocs(rulesList)
