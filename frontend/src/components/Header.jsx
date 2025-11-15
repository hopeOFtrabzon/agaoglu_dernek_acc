import { Avatar, Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { LogOut } from "lucide-react";

import { useAuth } from "../providers/AuthProvider";
import logo from "../assets/agaoglu-logo.png";

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
      <Flex align="center" gap={4}>
        <Image src={logo} alt="Ağaoğlu Dernek Logosu" maxH="64px" objectFit="contain" />
        <Heading as="h1" size="lg" mb={1} color="blue.700">
          Muhasebe Sistemi
        </Heading>
      </Flex>
      <Text color="gray.600" mt={{ base: 3, md: 0 }}>
        Tüm işlemleri tek yerden takip edin.
      </Text>
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
          Çıkış Yap
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
