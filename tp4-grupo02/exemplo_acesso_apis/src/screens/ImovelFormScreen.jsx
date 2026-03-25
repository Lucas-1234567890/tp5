// src/screens/ImovelFormScreen.jsx
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  useToast,
  VStack,
} from "native-base";

// Cache simples de CEP — mesmo padrão do componente web
const cepCache = {};
function fakeCepLookup(cep) {
  if (cepCache[cep]) return Promise.resolve(cepCache[cep]);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep) || cep.startsWith("0")) {
        reject(new Error("Renavan formato inválido."));
      } else {
        const data = {
          logradouro: "Rua Exemplo",
          bairro: "Bairro Exemplo",
          cidade: "Cidade Exemplo",
          estado: "EX",
        };
        cepCache[cep] = data;
        resolve(data);
      }
    }, 400);
  });
}

export default function ImovelFormScreen({ navigation }) {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLookup = () => {
    setError("");
    setLoading(true);
    fakeCepLookup(cep)
      .then((data) => {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.cidade);
        setEstado(data.estado);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const isValid = /^\d{5}-?\d{3}$/.test(cep) && !cep.startsWith("0");

  const handleSave = () => {
    if (!isValid || error) return;
    toast.show({ description: "Veículo salvo com sucesso!", status: "success" });
    // Volta para a aba Lista — goBack funciona independente da stack
    navigation.goBack();
  };

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Heading size="md" mb={4}>
          Novo Veículo
        </Heading>

        <Box bg="white" rounded="lg" shadow={1} p={4}>
          <VStack space={4}>
            {/* Renavan / CEP */}
            <FormControl isInvalid={!!error}>
              <FormControl.Label>Renavan</FormControl.Label>
              <HStack space={2}>
                <Input
                  flex={1}
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={setCep}
                  onBlur={() => cep && handleLookup()}
                  keyboardType="numeric"
                />
                <Button
                  onPress={handleLookup}
                  isDisabled={!cep || loading}
                  isLoading={loading}
                  px={4}
                >
                  Buscar
                </Button>
              </HStack>
              {!!error && (
                <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Logradouro + Número */}
            <HStack space={3}>
              <FormControl flex={2}>
                <FormControl.Label>Logradouro</FormControl.Label>
                <Input value={logradouro} isReadOnly bg="gray.100" />
              </FormControl>
              <FormControl flex={1}>
                <FormControl.Label>Número</FormControl.Label>
                <Input
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="numeric"
                />
              </FormControl>
            </HStack>

            {/* Bairro + Cidade */}
            <HStack space={3}>
              <FormControl flex={1}>
                <FormControl.Label>Bairro</FormControl.Label>
                <Input value={bairro} isReadOnly bg="gray.100" />
              </FormControl>
              <FormControl flex={1}>
                <FormControl.Label>Cidade</FormControl.Label>
                <Input value={cidade} isReadOnly bg="gray.100" />
              </FormControl>
            </HStack>

            {/* Estado */}
            <FormControl>
              <FormControl.Label>Estado</FormControl.Label>
              <Input value={estado} isReadOnly bg="gray.100" />
            </FormControl>

            <Button
              colorScheme="primary"
              size="lg"
              isDisabled={!isValid || !!error || loading}
              onPress={handleSave}
              mt={2}
            >
              Salvar
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}