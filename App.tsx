import { gql, useQuery, ApolloProvider } from "@apollo/client";
import { client } from "./lib/api/apolloClient";
import { Text, View } from "react-native";

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

function Hello() {
  const { loading, error, data } = useQuery(HELLO_QUERY);
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return <Text>GraphQL says: {data.hello}</Text>;
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Hello />
      </View>
    </ApolloProvider>
  );
}
