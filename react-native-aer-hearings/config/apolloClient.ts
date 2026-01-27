import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Update this with your actual GraphQL endpoint
const GRAPHQL_URI = 'https://your-api-endpoint.com/graphql'; // Replace with actual endpoint

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

// Add authentication headers if needed
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from storage if you have one
  // const token = await AsyncStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});


