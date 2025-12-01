import { Button, Flex, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../api";

const fetchSummary = async () => {
  const { data } = await api.get("/summary/");
  return data;
};

const SummaryCards = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary
  });

  const totals = data ?? { total_expenses: 0, total_profits: 0, net: 0 };

  return (
    <Flex direction="column" gap={4} mt={8}>
      <Flex align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="medium" color="gray.600">
          Financial Snapshot
        </Text>
        <Button
          size="sm"
          leftIcon={isFetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          onClick={() => refetch()}
          variant="ghost"
          colorScheme="blue"
          isDisabled={isLoading}
        >
          Refresh
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <SummaryStat
          label="Expenses"
          value={totals.total_expenses}
          help="Total spent"
          color="red.500"
          isLoading={isLoading}
        />
        <SummaryStat
          label="Profits"
          value={totals.total_profits}
          help="Total earned"
          color="green.500"
          isLoading={isLoading}
        />
        <SummaryStat
          label="Net Balance"
          value={totals.net}
          help={totals.net >= 0 ? "Balance positive" : "Balance negative"}
          color={totals.net >= 0 ? "green.500" : "red.500"}
          isLoading={isLoading}
        />
      </SimpleGrid>
    </Flex>
  );
};

const SummaryStat = ({ label, value, help, color, isLoading }) => (
  <Stat bg="white" borderRadius="lg" p={6} boxShadow="sm">
    <StatLabel color="gray.500">{label}</StatLabel>
    <StatNumber color={color}>
      {isLoading ? "--" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)}
    </StatNumber>
    <StatHelpText>{help}</StatHelpText>
  </Stat>
);

export default SummaryCards;
