import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../api";

const ProfitForm = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    source: "",
    date: ""
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/profits/", payload),
    onSuccess: () => {
      toast({ title: "Gelir kaydedildi", status: "success", duration: 3000, isClosable: true });
      setFormData({ description: "", amount: "", source: "", date: "" });
      queryClient.invalidateQueries({ queryKey: ["transactions", "profits"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast({ title: "Gelir kaydedilemedi", status: "error" });
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...formData, amount: Number(formData.amount) };
    mutation.mutate(payload);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4}>
        Gelir Ekle
      </Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Açıklama</FormLabel>
          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Danışmanlık projesi" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tutar</FormLabel>
          <Input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} placeholder="750.00" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Kaynak</FormLabel>
          <Input name="source" value={formData.source} onChange={handleChange} placeholder="Müşteri A" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tarih</FormLabel>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="green" isLoading={mutation.isPending}>
          Geliri Kaydet
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfitForm;
