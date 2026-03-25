// src/screens/LeilaoDetailScreen.jsx
// Recebe: { lotes: [], initialIndex: number, token: string }
// Navegação entre lotes via swipe horizontal — PanResponder lê index via ref para evitar closure stale
import { useCallback, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
  Badge,
  useToast,
} from "native-base";
import { PanResponder, StyleSheet, View } from "react-native";

export default function LeilaoDetailScreen({ route, navigation }) {
  const { lotes, initialIndex } = route.params;
  const [index, setIndex] = useState(initialIndex);
  const toast = useToast();

  // Ref espelha o state — PanResponder lê a ref (não o closure)
  // para não precisar recriar o PanResponder a cada render
  const indexRef = useRef(initialIndex);
  const updateIndex = useCallback((next) => {
    indexRef.current = next;
    setIndex(next);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        const cur = indexRef.current;
        if (g.dx < -60 && cur + 1 < lotes.length) {
          updateIndex(cur + 1);
        } else if (g.dx > 60 && cur > 0) {
          updateIndex(cur - 1);
        }
      },
    })
  ).current;

  const lote = lotes[index];

  const handleLance = () => {
    toast.show({
      description: "Lance registrado com sucesso!",
      status: "success",
      duration: 2000,
    });
  };

  if (!lote) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Nenhum veículo selecionado.</Text>
      </Box>
    );
  }

  const fields = [
    ["Marca", lote.marca],
    ["Modelo", lote.modelo],
    ["Ano Fabricação", lote.ano_fabricacao],
    ["Ano Modelo", lote.ano_modelo],
    ["Combustível", lote.combustivel],
    ["KM", lote.km],
    ["Câmbio Automático", lote.automatico ? "Sim" : "Não"],
    ["AR Condicionado", lote.ar ? "Sim" : "Não"],
    ["Ligando", lote.ligando ? "Sim" : "Não"],
    ["IPVA Pago", lote.ipva_pago ? "Sim" : "Não"],
    ["Valor Inicial", `R$ ${lote.valor_inicial ?? "0"}`],
    ["Lance Atual", `R$ ${lote.lance ?? "0"}`],
  ];

  return (
    // View nativa recebe panHandlers — Box do NativeBase não propaga corretamente
    <View style={styles.root} {...panResponder.panHandlers}>
      {/* Contador de posição */}
      <HStack justifyContent="center" alignItems="center" py={2} space={2}>
        <Text color="gray.400" fontSize="sm">
          ← swipe para navegar →
        </Text>
        <Badge colorScheme="info" rounded="full">
          {index + 1} / {lotes.length}
        </Badge>
      </HStack>

      <ScrollView flex={1}>
        <Box bg="white" rounded="lg" shadow={1} m={4} p={4}>
          <Text bold fontSize="lg" mb={3}>
            Veículo {index + 1}
          </Text>
          <Divider mb={3} />
          <VStack space={3}>
            {fields.map(([label, value]) => (
              <HStack key={label} justifyContent="space-between">
                <Text color="gray.500" flex={1}>
                  {label}
                </Text>
                <Text bold flex={1} textAlign="right">
                  {value != null ? String(value) : "Não informado"}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      {/* Botão de lance fixo no rodapé */}
      <Box bg="white" px={4} py={3} shadow={4}>
        <Button
          colorScheme="primary"
          size="lg"
          onPress={handleLance}
          _text={{ fontWeight: "bold" }}
        >
          Dar Lance
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
});