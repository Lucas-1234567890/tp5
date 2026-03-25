// src/screens/LeilaoListScreen.jsx
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  FlatList,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
  Pressable,
  useToast,
} from "native-base";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";

export default function LeilaoListScreen({ navigation, token }) {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchLotes = useCallback(
    (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      fetch(`${BASE_URL}/leiloes/72/lotes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setLotes(Array.isArray(data) ? data : []))
        .catch(() =>
          toast.show({ description: "Erro ao carregar lotes", status: "error" })
        )
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    [token]
  );

  useEffect(() => {
    fetchLotes();
  }, [fetchLotes]);

  if (loading) {
    return (
      <Box flex={1} p={4} bg="gray.50" safeArea>
        <VStack space={3}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} h="80px" rounded="md" />
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <Heading px={4} py={3} size="md">
        Veículos disponíveis
      </Heading>
      <FlatList
        data={lotes}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        refreshing={refreshing}
        onRefresh={() => fetchLotes(true)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ItemSeparatorComponent={() => <Box h="12px" />}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              // Passa lotes completo para permitir navegação entre lotes no Detalhe
              navigation.navigate("Detalhe", {
                lotes,
                initialIndex: index,
                token,
              })
            }
          >
            {({ isPressed }) => (
              <Box
                bg="white"
                rounded="lg"
                shadow={1}
                p={4}
                opacity={isPressed ? 0.85 : 1}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text bold fontSize="md">
                      Veículo {index + 1}
                    </Text>
                    <Text color="gray.500">
                      {item.marca || "—"} {item.modelo || ""}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Ano: {item.ano_modelo || "—"}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text color="primary.500" bold>
                      R$ {item.valor_inicial ?? "0"}
                    </Text>
                    <Text color="gray.400" fontSize="xs">
                      valor inicial
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
          </Pressable>
        )}
      />
    </Box>
  );
}