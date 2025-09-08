import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddCalculationInput = {
  communicationId: Scalars['ID']['input'];
  operation: Operation;
  parentCalculationId?: InputMaybe<Scalars['ID']['input']>;
  rightOperand: Scalars['Float']['input'];
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Auth payload for login response */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** JWT token */
  token: Scalars['String']['output'];
  /** Authenticated user */
  user: User;
};

/** Single calculation in a communication */
export type Calculation = {
  __typename?: 'Calculation';
  /** User who made this calculation */
  author: User;
  /** Communication this calculation belongs to */
  communication: Communication;
  /** When this calculation was created */
  createdAt: Scalars['String']['output'];
  /** Unique calculation ID */
  id: Scalars['ID']['output'];
  /** Previous number (from parent calculation or starting number) */
  leftOperand: Scalars['Float']['output'];
  /** Operation to perform */
  operation: Operation;
  /** Parent calculation (null for starting number) */
  parentCalculationId?: Maybe<Scalars['ID']['output']>;
  /** Result of the calculation */
  result: Scalars['Float']['output'];
  /** Right operand (user input) */
  rightOperand: Scalars['Float']['output'];
};

/** Communication thread containing calculations */
export type Communication = {
  __typename?: 'Communication';
  /** User who started this communication */
  author: User;
  /** Total number of calculations */
  calculationCount: Scalars['Int']['output'];
  /** All calculations in this communication */
  calculations: Array<Calculation>;
  /** When this communication was created */
  createdAt: Scalars['String']['output'];
  /** Latest result */
  currentResult: Scalars['Float']['output'];
  /** Unique communication ID */
  id: Scalars['ID']['output'];
  /** Number of unique participants */
  participantCount: Scalars['Int']['output'];
  /** Starting number for this communication */
  startingNumber: Scalars['Float']['output'];
  /** Title/description of the communication */
  title?: Maybe<Scalars['String']['output']>;
  /** When this communication was last updated */
  updatedAt: Scalars['String']['output'];
};

export type CreateCommunicationInput = {
  startingNumber: Scalars['Float']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCalculation: Calculation;
  createCommunication: Communication;
  createUser?: Maybe<User>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  login: AuthPayload;
  register: AuthPayload;
  updateUser?: Maybe<User>;
};


export type MutationAddCalculationArgs = {
  input: AddCalculationInput;
};


export type MutationCreateCommunicationArgs = {
  input: CreateCommunicationInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: CreateUserInput;
};

/** Math operation enum */
export enum Operation {
  Add = 'ADD',
  Divide = 'DIVIDE',
  Multiply = 'MULTIPLY',
  Subtract = 'SUBTRACT'
}

export type Query = {
  __typename?: 'Query';
  allCommunications: Array<Communication>;
  allUsers: Array<User>;
  communication?: Maybe<Communication>;
  communicationCalculations: Array<Calculation>;
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryCommunicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommunicationCalculationsArgs = {
  communicationId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  calculationAdded: Calculation;
  communicationCreated: Communication;
  communicationUpdated: Communication;
  userCreated?: Maybe<User>;
};


export type SubscriptionCalculationAddedArgs = {
  communicationId: Scalars['ID']['input'];
};


export type SubscriptionCommunicationUpdatedArgs = {
  communicationId: Scalars['ID']['input'];
};

/** User entity */
export type User = {
  __typename?: 'User';
  /** User creation date */
  createdAt: Scalars['String']['output'];
  /** Unique email */
  email: Scalars['String']['output'];
  /** Unique User ID */
  id: Scalars['ID']['output'];
  /** User active status */
  isActive: Scalars['Boolean']['output'];
  /** User Password */
  password: Scalars['String']['output'];
  /** User last update date */
  updatedAt: Scalars['String']['output'];
  /** Unique username */
  username: Scalars['String']['output'];
};

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  username
  email
  isActive
  createdAt
  updatedAt
}
    `;
export const CalculationFieldsFragmentDoc = gql`
    fragment CalculationFields on Calculation {
  id
  leftOperand
  operation
  rightOperand
  result
  createdAt
  parentCalculationId
  author {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const CommunicationFieldsFragmentDoc = gql`
    fragment CommunicationFields on Communication {
  id
  startingNumber
  title
  currentResult
  calculationCount
  participantCount
  createdAt
  updatedAt
  calculations {
    ...CalculationFields
  }
  author {
    ...UserFields
  }
}
    ${CalculationFieldsFragmentDoc}
${UserFieldsFragmentDoc}`;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
      email
      isActive
      createdAt
      updatedAt
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: CreateUserInput!) {
  register(input: $input) {
    token
    user {
      id
      username
      email
      isActive
      createdAt
      updatedAt
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const AllCommunicationsDocument = gql`
    query AllCommunications {
  allCommunications {
    ...CommunicationFields
  }
}
    ${CommunicationFieldsFragmentDoc}`;

/**
 * __useAllCommunicationsQuery__
 *
 * To run a query within a React component, call `useAllCommunicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllCommunicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllCommunicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllCommunicationsQuery(baseOptions?: Apollo.QueryHookOptions<AllCommunicationsQuery, AllCommunicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllCommunicationsQuery, AllCommunicationsQueryVariables>(AllCommunicationsDocument, options);
      }
export function useAllCommunicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllCommunicationsQuery, AllCommunicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllCommunicationsQuery, AllCommunicationsQueryVariables>(AllCommunicationsDocument, options);
        }
export function useAllCommunicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllCommunicationsQuery, AllCommunicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllCommunicationsQuery, AllCommunicationsQueryVariables>(AllCommunicationsDocument, options);
        }
export type AllCommunicationsQueryHookResult = ReturnType<typeof useAllCommunicationsQuery>;
export type AllCommunicationsLazyQueryHookResult = ReturnType<typeof useAllCommunicationsLazyQuery>;
export type AllCommunicationsSuspenseQueryHookResult = ReturnType<typeof useAllCommunicationsSuspenseQuery>;
export type AllCommunicationsQueryResult = Apollo.QueryResult<AllCommunicationsQuery, AllCommunicationsQueryVariables>;
export const CommunicationDocument = gql`
    query Communication($id: ID!) {
  communication(id: $id) {
    ...CommunicationFields
  }
}
    ${CommunicationFieldsFragmentDoc}`;

/**
 * __useCommunicationQuery__
 *
 * To run a query within a React component, call `useCommunicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommunicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommunicationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCommunicationQuery(baseOptions: Apollo.QueryHookOptions<CommunicationQuery, CommunicationQueryVariables> & ({ variables: CommunicationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommunicationQuery, CommunicationQueryVariables>(CommunicationDocument, options);
      }
export function useCommunicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommunicationQuery, CommunicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommunicationQuery, CommunicationQueryVariables>(CommunicationDocument, options);
        }
export function useCommunicationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommunicationQuery, CommunicationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommunicationQuery, CommunicationQueryVariables>(CommunicationDocument, options);
        }
export type CommunicationQueryHookResult = ReturnType<typeof useCommunicationQuery>;
export type CommunicationLazyQueryHookResult = ReturnType<typeof useCommunicationLazyQuery>;
export type CommunicationSuspenseQueryHookResult = ReturnType<typeof useCommunicationSuspenseQuery>;
export type CommunicationQueryResult = Apollo.QueryResult<CommunicationQuery, CommunicationQueryVariables>;
export const CommunicationCalculationsDocument = gql`
    query CommunicationCalculations($communicationId: ID!) {
  communicationCalculations(communicationId: $communicationId) {
    ...CalculationFields
  }
}
    ${CalculationFieldsFragmentDoc}`;

/**
 * __useCommunicationCalculationsQuery__
 *
 * To run a query within a React component, call `useCommunicationCalculationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommunicationCalculationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommunicationCalculationsQuery({
 *   variables: {
 *      communicationId: // value for 'communicationId'
 *   },
 * });
 */
export function useCommunicationCalculationsQuery(baseOptions: Apollo.QueryHookOptions<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables> & ({ variables: CommunicationCalculationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>(CommunicationCalculationsDocument, options);
      }
export function useCommunicationCalculationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>(CommunicationCalculationsDocument, options);
        }
export function useCommunicationCalculationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>(CommunicationCalculationsDocument, options);
        }
export type CommunicationCalculationsQueryHookResult = ReturnType<typeof useCommunicationCalculationsQuery>;
export type CommunicationCalculationsLazyQueryHookResult = ReturnType<typeof useCommunicationCalculationsLazyQuery>;
export type CommunicationCalculationsSuspenseQueryHookResult = ReturnType<typeof useCommunicationCalculationsSuspenseQuery>;
export type CommunicationCalculationsQueryResult = Apollo.QueryResult<CommunicationCalculationsQuery, CommunicationCalculationsQueryVariables>;
export const CreateCommunicationDocument = gql`
    mutation CreateCommunication($input: CreateCommunicationInput!) {
  createCommunication(input: $input) {
    ...CommunicationFields
  }
}
    ${CommunicationFieldsFragmentDoc}`;
export type CreateCommunicationMutationFn = Apollo.MutationFunction<CreateCommunicationMutation, CreateCommunicationMutationVariables>;

/**
 * __useCreateCommunicationMutation__
 *
 * To run a mutation, you first call `useCreateCommunicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommunicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommunicationMutation, { data, loading, error }] = useCreateCommunicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCommunicationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommunicationMutation, CreateCommunicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommunicationMutation, CreateCommunicationMutationVariables>(CreateCommunicationDocument, options);
      }
export type CreateCommunicationMutationHookResult = ReturnType<typeof useCreateCommunicationMutation>;
export type CreateCommunicationMutationResult = Apollo.MutationResult<CreateCommunicationMutation>;
export type CreateCommunicationMutationOptions = Apollo.BaseMutationOptions<CreateCommunicationMutation, CreateCommunicationMutationVariables>;
export const AddCalculationDocument = gql`
    mutation AddCalculation($input: AddCalculationInput!) {
  addCalculation(input: $input) {
    ...CalculationFields
  }
}
    ${CalculationFieldsFragmentDoc}`;
export type AddCalculationMutationFn = Apollo.MutationFunction<AddCalculationMutation, AddCalculationMutationVariables>;

/**
 * __useAddCalculationMutation__
 *
 * To run a mutation, you first call `useAddCalculationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCalculationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCalculationMutation, { data, loading, error }] = useAddCalculationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCalculationMutation(baseOptions?: Apollo.MutationHookOptions<AddCalculationMutation, AddCalculationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCalculationMutation, AddCalculationMutationVariables>(AddCalculationDocument, options);
      }
export type AddCalculationMutationHookResult = ReturnType<typeof useAddCalculationMutation>;
export type AddCalculationMutationResult = Apollo.MutationResult<AddCalculationMutation>;
export type AddCalculationMutationOptions = Apollo.BaseMutationOptions<AddCalculationMutation, AddCalculationMutationVariables>;
export const CommunicationUpdatedDocument = gql`
    subscription CommunicationUpdated($communicationId: ID!) {
  communicationUpdated(communicationId: $communicationId) {
    ...CommunicationFields
  }
}
    ${CommunicationFieldsFragmentDoc}`;

/**
 * __useCommunicationUpdatedSubscription__
 *
 * To run a query within a React component, call `useCommunicationUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommunicationUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommunicationUpdatedSubscription({
 *   variables: {
 *      communicationId: // value for 'communicationId'
 *   },
 * });
 */
export function useCommunicationUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<CommunicationUpdatedSubscription, CommunicationUpdatedSubscriptionVariables> & ({ variables: CommunicationUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CommunicationUpdatedSubscription, CommunicationUpdatedSubscriptionVariables>(CommunicationUpdatedDocument, options);
      }
export type CommunicationUpdatedSubscriptionHookResult = ReturnType<typeof useCommunicationUpdatedSubscription>;
export type CommunicationUpdatedSubscriptionResult = Apollo.SubscriptionResult<CommunicationUpdatedSubscription>;
export const CommunicationCreatedDocument = gql`
    subscription CommunicationCreated {
  communicationCreated {
    ...CommunicationFields
  }
}
    ${CommunicationFieldsFragmentDoc}`;

/**
 * __useCommunicationCreatedSubscription__
 *
 * To run a query within a React component, call `useCommunicationCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommunicationCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommunicationCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCommunicationCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CommunicationCreatedSubscription, CommunicationCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CommunicationCreatedSubscription, CommunicationCreatedSubscriptionVariables>(CommunicationCreatedDocument, options);
      }
export type CommunicationCreatedSubscriptionHookResult = ReturnType<typeof useCommunicationCreatedSubscription>;
export type CommunicationCreatedSubscriptionResult = Apollo.SubscriptionResult<CommunicationCreatedSubscription>;
export const CalculationAddedDocument = gql`
    subscription CalculationAdded($communicationId: ID!) {
  calculationAdded(communicationId: $communicationId) {
    ...CalculationFields
  }
}
    ${CalculationFieldsFragmentDoc}`;

/**
 * __useCalculationAddedSubscription__
 *
 * To run a query within a React component, call `useCalculationAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCalculationAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalculationAddedSubscription({
 *   variables: {
 *      communicationId: // value for 'communicationId'
 *   },
 * });
 */
export function useCalculationAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<CalculationAddedSubscription, CalculationAddedSubscriptionVariables> & ({ variables: CalculationAddedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CalculationAddedSubscription, CalculationAddedSubscriptionVariables>(CalculationAddedDocument, options);
      }
export type CalculationAddedSubscriptionHookResult = ReturnType<typeof useCalculationAddedSubscription>;
export type CalculationAddedSubscriptionResult = Apollo.SubscriptionResult<CalculationAddedSubscription>;
export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type RegisterMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string };

export type AllCommunicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCommunicationsQuery = { __typename?: 'Query', allCommunications: Array<{ __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }> };

export type CommunicationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CommunicationQuery = { __typename?: 'Query', communication?: { __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } | null };

export type CommunicationCalculationsQueryVariables = Exact<{
  communicationId: Scalars['ID']['input'];
}>;


export type CommunicationCalculationsQuery = { __typename?: 'Query', communicationCalculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }> };

export type CreateCommunicationMutationVariables = Exact<{
  input: CreateCommunicationInput;
}>;


export type CreateCommunicationMutation = { __typename?: 'Mutation', createCommunication: { __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type AddCalculationMutationVariables = Exact<{
  input: AddCalculationInput;
}>;


export type AddCalculationMutation = { __typename?: 'Mutation', addCalculation: { __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type CommunicationFieldsFragment = { __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } };

export type CalculationFieldsFragment = { __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } };

export type CommunicationUpdatedSubscriptionVariables = Exact<{
  communicationId: Scalars['ID']['input'];
}>;


export type CommunicationUpdatedSubscription = { __typename?: 'Subscription', communicationUpdated: { __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type CommunicationCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CommunicationCreatedSubscription = { __typename?: 'Subscription', communicationCreated: { __typename?: 'Communication', id: string, startingNumber: number, title?: string | null, currentResult: number, calculationCount: number, participantCount: number, createdAt: string, updatedAt: string, calculations: Array<{ __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } }>, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };

export type CalculationAddedSubscriptionVariables = Exact<{
  communicationId: Scalars['ID']['input'];
}>;


export type CalculationAddedSubscription = { __typename?: 'Subscription', calculationAdded: { __typename?: 'Calculation', id: string, leftOperand: number, operation: Operation, rightOperand: number, result: number, createdAt: string, parentCalculationId?: string | null, author: { __typename?: 'User', id: string, username: string, email: string, isActive: boolean, createdAt: string, updatedAt: string } } };
