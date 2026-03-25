// src/screens/LoginScreen.jsx
import { useEffect } from "react";
import { Center, Spinner, Text, VStack, Heading } from "native-base";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";

export default function LoginScreen({ onToken }) {
  useEffect(() => {
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "leilao_test_api", password: "Ftwj029E" }),
    })
      .then((r) => r.json())
      .then((r) => onToken(r.accessToken))
      .catch((err) => console.error("Erro no login:", err));
  }, [onToken]);

  return (
    <Center flex={1} bg="white">
      <VStack space={4} alignItems="center">
        <Heading size="lg" color="primary.500">
          Leilões
        </Heading>
        <Spinner size="lg" color="primary.500" />
        <Text color="gray.500">Autenticando...</Text>
      </VStack>
    </Center>
  );
}