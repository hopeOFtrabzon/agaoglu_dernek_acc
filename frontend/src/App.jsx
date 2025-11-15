import { Box, Container } from "@chakra-ui/react";

import DashboardLayout from "./components/DashboardLayout";
import LoginView from "./components/LoginView";
import { useAuth } from "./providers/AuthProvider";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={10} px={4}>
        {isAuthenticated ? <DashboardLayout /> : <LoginView />}
      </Container>
    </Box>
  );
};

export default App;
