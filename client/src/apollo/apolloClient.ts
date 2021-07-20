import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';
// import { merge } from 'lodash';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// const link = new HttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include'
// });

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // @ts-ignore
    link: ApolloLink.from([errorLink, uploadLink]),
    cache: new InMemoryCache(),
    assumeImmutableResults: true,
    credentials: 'include'
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient: ApolloClient<NormalizedCacheObject> = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  if (typeof window === 'undefined') {
    return _apolloClient;
  }
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }
  return _apolloClient;
}

export function useApollo(initialState: any = null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
