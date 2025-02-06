import gql from "graphql-tag"
import { referenceTypeSkipKey } from "../constants/map-types"

export const getEntityById = (type: string) => {
    const skipKey = referenceTypeSkipKey.includes(type)
    return gql`
      query ${type}($id: String!) {
        ${type}(id: $id) {
          id
          ${skipKey ? '' : 'key'}
        }
      }
    `
}