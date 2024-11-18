import { DocumentNode } from 'graphql';

export interface GraphQLClient {
  query<T>(options: {
    query: DocumentNode;
    variables?: Record<string, any>;
    context?: any;
  }): Promise<{ data: T }>;
  mutate<T>(options: {
    mutation: DocumentNode;
    variables?: Record<string, any>;
    context?: any;
  }): Promise<{ data: T }>;
}
