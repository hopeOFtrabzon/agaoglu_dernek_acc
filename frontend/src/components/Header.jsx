import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { LogOut } from "lucide-react";

import { useAuth } from "../providers/AuthProvider";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Flex
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      p={6}
      align={{ base: "stretch", md: "center" }}
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      gap={4}
    >
      <Box>
        <Heading as="h1" size="lg" mb={1} color="blue.700">
          Accounting System
        </Heading>
        <Text color="gray.600">Monitor every transaction in one place.</Text>
      </Box>
      <Flex align="center" gap={4}>
        <Avatar name={user?.username} size="md" />
        <Box>
          <Text fontWeight="bold">{user?.username}</Text>
          <Text fontSize="sm" color="gray.500">
            {user?.email}
          </Text>
        </Box>
        <Button
          leftIcon={<LogOut size={16} />}
          colorScheme="red"
          variant="outline"
          onClick={logout}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
