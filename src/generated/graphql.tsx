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

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUsersToRole?: Maybe<Role>;
  createRole?: Maybe<Role>;
  createUser?: Maybe<User>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  updateUser?: Maybe<User>;
};


export type MutationAddUsersToRoleArgs = {
  roleId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: CreateUserInput;
};

export type Query = {
  __typename?: 'Query';
  allRoles: Array<Role>;
  allUsers: Array<User>;
  role?: Maybe<Role>;
  user?: Maybe<User>;
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

/** Role entity */
export type Role = {
  __typename?: 'Role';
  /** Role creation date */
  createdAt: Scalars['String']['output'];
  /** Role description */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique Role ID */
  id: Scalars['ID']['output'];
  /** Unique Role name */
  name: Scalars['String']['output'];
  /** Role last update date */
  updatedAt: Scalars['String']['output'];
  /** Users in the Role */
  users: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  userCreated?: Maybe<User>;
};

/** User entity */
export type User = {
  __typename?: 'User';
  /** Unique email */
  email: Scalars['String']['output'];
  /** Unique User ID */
  id: Scalars['ID']['output'];
  /** User Password */
  password: Scalars['String']['output'];
  /** Unique username */
  username: Scalars['String']['output'];
};

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  username
  email
}
    `;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  allUsers {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetAllRolesDocument = gql`
    query GetAllRoles {
  allRoles {
    id
    name
    users {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useGetAllRolesQuery__
 *
 * To run a query within a React component, call `useGetAllRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, options);
      }
export function useGetAllRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, options);
        }
export function useGetAllRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllRolesQuery, GetAllRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllRolesQuery, GetAllRolesQueryVariables>(GetAllRolesDocument, options);
        }
export type GetAllRolesQueryHookResult = ReturnType<typeof useGetAllRolesQuery>;
export type GetAllRolesLazyQueryHookResult = ReturnType<typeof useGetAllRolesLazyQuery>;
export type GetAllRolesSuspenseQueryHookResult = ReturnType<typeof useGetAllRolesSuspenseQuery>;
export type GetAllRolesQueryResult = Apollo.QueryResult<GetAllRolesQuery, GetAllRolesQueryVariables>;
export const OnUserCreatedDocument = gql`
    subscription OnUserCreated {
  userCreated {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useOnUserCreatedSubscription__
 *
 * To run a query within a React component, call `useOnUserCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUserCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnUserCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnUserCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnUserCreatedSubscription, OnUserCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnUserCreatedSubscription, OnUserCreatedSubscriptionVariables>(OnUserCreatedDocument, options);
      }
export type OnUserCreatedSubscriptionHookResult = ReturnType<typeof useOnUserCreatedSubscription>;
export type OnUserCreatedSubscriptionResult = Apollo.SubscriptionResult<OnUserCreatedSubscription>;
export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, email: string };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, username: string, email: string }> };

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRolesQuery = { __typename?: 'Query', allRoles: Array<{ __typename?: 'Role', id: string, name: string, users: Array<{ __typename?: 'User', id: string, username: string, email: string }> }> };

export type OnUserCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUserCreatedSubscription = { __typename?: 'Subscription', userCreated?: { __typename?: 'User', id: string, username: string, email: string } | null };
