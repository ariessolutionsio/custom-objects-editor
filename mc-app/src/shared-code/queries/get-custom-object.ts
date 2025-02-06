import gql from 'graphql-tag';

export default gql`
  query customObject($key: String!, $container: String!) {
    customObject(key: $key, container: $container) {
      id
      lastModifiedAt
      container
      key
      value
    }
  }
`;
