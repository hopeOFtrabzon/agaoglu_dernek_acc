import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useToast
} from "@chakra-ui/react";

import { useAuth } from "../providers/AuthProvider";

const LoginView = () => {
  const toast = useToast();
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: ""
  });

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "login") {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null
        });
        await login({ email: formData.email, password: formData.password });
        toast({ title: "Hesap oluşturuldu", status: "success" });
      }
    } catch (error) {
      toast({
        title: "Kimlik doğrulama başarısız",
        description: error.response?.data?.detail || error.message,
        status: "error"
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="70vh">
      <Box bg="white" p={10} borderRadius="xl" boxShadow="lg" w="full" maxW="480px">
        <Heading mb={6} textAlign="center">
          {mode === "login" ? "Tekrar hoş geldiniz" : "Hesap oluşturun"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {mode === "register" && (
              <>
                <FormControl isRequired>
                  <FormLabel>Kullanıcı adı</FormLabel>
                  <Input name="username" value={formData.username} onChange={handleChange} placeholder="acme-finans" />
                </FormControl>
                <Flex gap={4} flexWrap="wrap">
                  <FormControl flex="1 1 45%">
                    <FormLabel>Ad</FormLabel>
                    <Input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Ada" />
                  </FormControl>
                  <FormControl flex="1 1 45%">
                    <FormLabel>Soyad</FormLabel>
                    <Input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Lovelace" />
                  </FormControl>
                </Flex>
              </>
            )}
            <FormControl isRequired>
              <FormLabel>E-posta</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="siz@sirket.com" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Şifre</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********" />
            </FormControl>
            <Button type="submit" colorScheme="blue" isLoading={loading}>
              {mode === "login" ? "Giriş Yap" : "Kaydol"}
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center" color="gray.600">
          {mode === "login" ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}{" "}
          <Link color="blue.500" onClick={toggleMode} fontWeight="semibold">
            {mode === "login" ? "Hemen oluşturun" : "Giriş yapın"}
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginView;
