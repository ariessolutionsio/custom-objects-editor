import gql from "graphql-tag"

export const getEntityByKey = (type: string) => {
    return gql`
      query ${type}($key: String!) {
        ${type}(key: $key) {
          id
          key
        }
      }
    `
}