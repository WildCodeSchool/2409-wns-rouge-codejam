import { adjectives, animals, colors, Config } from 'unique-names-generator'

export const BASE_NAME_CONFIG: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
}
