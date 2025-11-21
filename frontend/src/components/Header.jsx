import { useState } from "react";
import { Avatar, Box, Button, Flex, Heading, Image, Text, useToast } from "@chakra-ui/react";
import { Download, LogOut } from "lucide-react";

import { useAuth } from "../providers/AuthProvider";
import logo from "../assets/agaoglu-logo.png";
import { api } from "../api";

const Header = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const { data } = await api.get("/reports/export", { responseType: "blob" });

      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `gelir-gider-raporu-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({ title: "Excel indirildi", status: "success" });
    } catch (error) {
      toast({
        title: "Excel indirilemedi",
        description: error.response?.data?.message ?? "Lütfen tekrar deneyin.",
        status: "error"
      });
    } finally {
      setIsExporting(false);
    }
  };

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
        İşlerinizi tek noktadan takip edin.
      </Text>
      <Flex align="center" gap={4} flexWrap="wrap" justify="flex-end">
        <Avatar name={user?.username} size="md" />
        <Box>
          <Text fontWeight="bold">{user?.username}</Text>
          <Text fontSize="sm" color="gray.500">
            {user?.email}
          </Text>
        </Box>
        <Button
          leftIcon={<Download size={16} />}
          colorScheme="blue"
          variant="solid"
          onClick={handleExport}
          isLoading={isExporting}
        >
          Excel'e Aktar
        </Button>
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
