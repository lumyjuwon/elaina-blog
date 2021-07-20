import React from 'react';
import { ApolloClient, NormalizedCacheObject, InMemoryCache, ApolloLink } from '@apollo/client';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function withApollo(PageComponent: any, { ssr = true } = {}) {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: NormalizedCacheObject;
  }) => {
    const client = apolloClient || initApolloClient(apolloState);
    return <PageComponent {...pageProps} apolloClient={client}></PageComponent>;
  };

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (context: any) => {
      const { AppTree, ctx } = context;
      const apolloClient = (context.apolloClient = initApolloClient({}, ctx.req?.headers.cookie));

      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(context);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }
        }
      }

      // Extract query data from the Apollo store
      // @ts-ignore
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState
      };
    };
  }

  return WithApollo;
}

export function initApolloClient(initialState: NormalizedCacheObject = {}, ctx: NextPageContext | GetServerSidePropsContext | null = null) {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx);
  }

  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

function createApolloClient(
  initialState: NormalizedCacheObject = {},
  ctx: NextPageContext | GetServerSidePropsContext | null = null
): ApolloClient<NormalizedCacheObject> {
  const enhancedFetch = (url: string, init: any) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        cookie: ctx?.req?.headers.cookie || '',
        'user-agent': ctx?.req?.headers['user-agent']
      }
    }).then((response) => {
      return response;
    });
  };

  const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    fetch: enhancedFetch,
    fetchOptions: {
      credentials: 'same-origin'
    }
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // @ts-ignore
    link: ApolloLink.from([errorLink, uploadLink]),
    cache: new InMemoryCache({ addTypename: false }).restore(initialState),
    assumeImmutableResults: true,
    credentials: 'include'
  });
}
