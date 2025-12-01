import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  useToast
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { api } from "../api";

const TransactionList = ({ type }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", type, { search }],
    queryFn: async ({ queryKey }) => {
      const [, resource, filters] = queryKey;
      const { data: response } = await api.get(`/${resource}/`, {
        params: {
          search: filters.search || undefined
        }
      });
      return response;
    }
  });

  const mutation = useMutation({
    mutationFn: (id) => api.delete(`/${type}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", type] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast({ title: "Record deleted", status: "info" });
    }
  });

  const items = data ?? [];

  const hintKey = type === "expenses" ? "category" : "source";

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={4} gap={3} flexWrap="wrap">
        <Heading size="md">{type === "expenses" ? "Recent Expenses" : "Recent Profits"}</Heading>
        <Input
          placeholder="Filter by description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          maxW={{ base: "full", md: "250px" }}
        />
      </Flex>
      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={4} maxH="480px" overflowY="auto">
          {items.length === 0 && (
            <Text color="gray.500">No records yet.</Text>
          )}
          {items.map((item) => (
            <Flex
              key={item.id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="semibold">{item.description}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(item.date).toLocaleDateString("en-US")} • {item[hintKey]}
                </Text>
              </Box>
              <Flex gap={3} align="center">
                <Text fontWeight="bold" color={type === "expenses" ? "red.500" : "green.500"}>
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                </Text>
                <IconButton
                  icon={<Trash2 size={16} />}
                  aria-label="delete"
                  colorScheme="red"
                  variant="ghost"
                  isLoading={mutation.isPending}
                  onClick={() => mutation.mutate(item.id)}
                />
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TransactionList;
