// src/lib/apollo-client.ts
import { ApolloClient, ApolloError, ApolloLink, createHttpLink, FetchResult, InMemoryCache, Operation, split } from '@apollo/client';
import { getMainDefinition, isNonNullObject, Observable } from '@apollo/client/utilities';
import { Client, createClient } from 'graphql-ws';
import { print } from 'graphql';

interface LikeCloseEvent {
  readonly code: number;
  readonly reason: string;
}

function isLikeCloseEvent(value: unknown): value is LikeCloseEvent {
  return isNonNullObject(value) && 'code' in value && 'reason' in value;
}

class GraphQLWsLink extends ApolloLink {
  constructor(public readonly client: Client) {
    super();
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      return this.client.subscribe(
        { ...operation, query: print(operation.query) },
        {
          next: observer.next.bind(observer) ?? undefined,
          complete: observer.complete.bind(observer),
          error: (error) => {
            if (error instanceof Error) {
              return observer.error(error);
            }

            if (isLikeCloseEvent(error)) {
              return observer.error(
                // reason will be available on clean closes
                new Error(`Socket closed with event ${error.code} ${error.reason || ''}`)
              );
            }

            return observer.error(
              new ApolloError({
                graphQLErrors: Array.isArray(error) ? error : [error],
              })
            );
          },
        }
      );
    });
  }
}

const httpLink = (apiUrl: string) => createHttpLink({ uri: `${apiUrl}/graphql` });

// Create a WebSocket link:
const wsLink = (wsUrl: string, token?: string) => {
  return new GraphQLWsLink(
    createClient({
      url: wsUrl,
      shouldRetry: () => true,
      connectionParams: () => {
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    })
  );
};

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const getLink = (API_URL: string, WS_URL: string, token?: string) => {
  return split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink(WS_URL, token),
    httpLink(API_URL)
  );
}


const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    getLink('http://localhost:8000', 'ws://localhost:8000/graphql'),
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default apolloClient;
