import { DocumentNode } from 'graphql';

export interface GraphQLClient {
  query<T>(options: {
    query: DocumentNode;
    variables?: Record<string, any>;
    context?: any;
  }): Promise<{ data: T }>;
}
