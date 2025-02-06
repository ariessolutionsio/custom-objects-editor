import gql from 'graphql-tag';

export default gql`
  mutation UpdateCustomObject($draft: CustomObjectDraft!) {
    createOrUpdateCustomObject(draft: $draft) {
      id
      version
      key
      container
    }
  }
`;
