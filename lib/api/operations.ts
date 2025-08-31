import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) { accessToken refreshToken }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      id userName email role
    }
  }
`;

export const GET_PROFILE = gql`
  query profile {
    profile { id userName email role }
  }
`;
