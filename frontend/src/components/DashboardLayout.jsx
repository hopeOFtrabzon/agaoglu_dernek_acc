import { useState } from "react";
import { Box, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import ExpenseForm from "./ExpenseForm";
import Header from "./Header";
import ProfitForm from "./ProfitForm";
import SummaryCards from "./SummaryCards";
import TransactionList from "./TransactionList";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Header />
      <SummaryCards />
      <Tabs
        mt={10}
        variant="enclosed"
        index={activeTab}
        onChange={setActiveTab}
        colorScheme="blue"
      >
        <TabList>
          <Tab fontWeight="semibold">Giderler</Tab>
          <Tab fontWeight="semibold">Gelirler</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} alignItems="flex-start">
              <ExpenseForm />
              <TransactionList type="expenses" />
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={0} pt={6}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} alignItems="flex-start">
              <ProfitForm />
              <TransactionList type="profits" />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DashboardLayout;
