import {
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";
import React from 'react';
import { render } from 'react-dom';
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { HttpLink } from "apollo-link-http";
import { sha256 } from 'crypto-hash';

 
const EXCHANGE_RATES = gql`
query GetExchangeRates {
  rates(currency: "USD") {
    currency
    rate
  }
}
`;

function ExchangeRates() {
const { loading, error, data } = useQuery(EXCHANGE_RATES);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error :(</p>;

return data.rates.map(({ currency, rate }) => (
  <div key={currency}>
    <p>
      {currency}: {rate}
    </p>
  </div>
));
}

  const linkChain = createPersistedQueryLink({ sha256, useGETForHashedQueries: true }).concat(
  new HttpLink({ uri: "http://localhost:30002/graphql" }));

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: linkChain,
    connectToDevTools: true
    
  });

  function App() {
    return (
      <div>
        <h2>My first Apollo app 🚀</h2>
      </div>
    );
  }
  
  render(
    <ApolloProvider client={client}>
      <App />
      <ExchangeRates />
    </ApolloProvider>,
    document.getElementById('root'),
  );

 