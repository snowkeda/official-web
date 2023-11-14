import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { betPs, betCs, betPsCs } from '@/utils/gql'
const client = new ApolloClient({
  uri: APOLLO_CLIENT_URI,
  cache: new InMemoryCache({
    addTypename: false,
    resultCaching: false,
  }),
});

export const getBetPsCs = (payload) => {
  return client.query({
    query: gql(betPsCs(payload)),
    fetchPolicy: "no-cache",
    variables: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    }
  }).catch((error) => {
    console.log(error)
  })
}

export const getBetPs = (payload) => {
  return client.query({
    query: gql(betPs(payload)),
    fetchPolicy: "no-cache",
    variables: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    }
  }).catch((error) => {
    console.log(error)
  })
}

export const getBetCs = (payload) => {
  return client.query({
    query: gql(betCs(payload)),
    fetchPolicy: "no-cache",
    variables: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    }
  })
}