'use client';

import apolloClient from '@/lib/apollo-client';
import { ApolloProvider as Provider } from '@apollo/client';

type Props = {
  children: React.ReactNode;
};

const ApolloProvider = ({ children }: Props) => {
  return <Provider client={apolloClient}>{children}</Provider>;
};

export default ApolloProvider;
