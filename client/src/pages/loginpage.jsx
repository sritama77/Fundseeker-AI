"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState } from "react"
import { Mail, KeyRound } from 'lucide-react';
import { PasswordInput } from "../components/ui/password-input"
import axios from 'axios';

function LoginPage({ pageSet }) {
  const [Password, setPassword] = useState("")
  const [Email, setEmail] = useState("")

  async function LoginHandler() {

    const resInvestor = await axios.post(`${import.meta.env.VITE_SERVER_URL}/logininvestor`, {

      "Email": Email,
      "Password": Password,

    })
    const resStartup = await axios.post(`${import.meta.env.VITE_SERVER_URL}/loginstartup`, {

      "Email": Email,
      "Password": Password,

    })
    if (resInvestor.data.message === "success" || resStartup.data.message === "success") {
      setTimeout(() => {
        pageSet(11)
      }, 1500)
      return toast.success("Logged in Successfully")
    }
    else {
      return toast.error("Wrong Email/Password")
    }


  }







  return (
    <Box
      height="100%"
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      bg="linear-gradient(90deg, #011F3C 0%, #033F79 50%, #011F3C 100%)"
    >

      <Toaster />
      <Box height="95%"
        width={"60%"}
        zIndex={1}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box                                                //fundseeker logo
          height={"20%"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={2}>
          <Image height={"50%"}
            width={"auto"}
            display={"flex"}
            src="/fundseeker_logo.png" />

          <Text                                             //fundseeker ai text
            className="useNunito"
            color="#D2B47D"
            fontSize="20px"
            letterSpacing={1}
            fontWeight={600}
            textAlign="center"
          >
            FundSeeker AI
          </Text>
        </Box>
        <Text                                             //Sign up text
          fontFamily={"Poppins"}
          color="white"
          fontSize="35px"
          fontWeight={700}
          textAlign="center"
          paddingBottom="5px"
        >
          Log In
        </Text>
        <Box                                              //golden line
          height="2px"
          width={"80%"}
          borderRadius="full"
          backgroundColor={"#E5C48A"}
          mt="4px" />
        <Box height="90%"
          width={"70%"}
          zIndex={2}
          mt={14}
          gap={2}
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexDirection={"column"}
        //bgColor={"red"}
        >

          <Box height="80%"                   // opacity kom wala white box
            width={"100%"}
            zIndex={3}
            display={"flex"}
            justifyContent={"flex-start"}
            padding={"20px"}
            gap={8}
            alignItems={"center"}
            flexDirection={"column"}
            bgColor={"rgba(255, 255, 255, 0.1)"}
            borderRadius={"20px"}
          >
            <Text                                             //login details text
              fontFamily={"Poppins"}
              color="white"
              fontSize="17px"
              fontWeight={400}
              textAlign="center"
            >
              Enter your login details
            </Text>

            <InputGroup startElement={<Mail color="white" />}        // email input
              height={"12%"}
              width={"80%"}
              display={"flex"}
              justifyContent={"left"}
              alignItems={"center"}>
              <Input
                height={"100%"}
                width={"100%"}
                bgColor={"rgba(255, 255, 255, 0.1)"}
                color={"white"}
                fontFamily={"Poppins"}
                placeholder='Email'
                border={"1px solid #FFF"}
                onChange={
                  (e) => {
                    const value = e.target.value;
                    toast.dismiss();
                    if (value.includes("@gmail.com") || value.includes("@gmail.com")) {
                      setEmail(value);
                    } else {
                      toast.error("Enter valid email.");

                    }
                  }}
              />
            </InputGroup>


            <InputGroup startElement={<KeyRound color="white" />}        // password input
              height={"12%"}
              width={"80%"}
              display={"flex"}
              justifyContent={"left"}
              alignItems={"center"}>
              <PasswordInput
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                display={"flex"}
                bgColor={"rgba(255, 255, 255, 0.1)"}
                color={"white"}
                fontFamily={"Poppins"}
                placeholder='Password'
                border={"1px solid #FFF"}
              />
            </InputGroup>

            <Button                                               //next button
              width="200px"
              color="#011F3C"
              borderRadius={"10px"}
              fontFamily={"Poppins"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              fontSize={"16px"}

              _hover={{
                backgroundColor: "#E5C48A",
                color: "#011F3C",
                borderColor: "#E5C48A",
              }}
              onClick={()=>LoginHandler()}
              transition="all 0.5s ease">    Log in  </Button>
            <Box height="6%"
              width={"60%"}
              zIndex={3}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"row"}
              gap={1}
            >
              <Text                                             //login now text nicher ta
                fontFamily={"Poppins"}
                color="white"
                fontSize="12px"
                fontWeight={400}
                textAlign="center"
              >
                Don't have an account?
              </Text>
              <Text                                             //signup now
                fontFamily={"Poppins"}
                color="white"
                fontSize="12px"
                fontWeight={600}
                textAlign="center"
                onClick={() => { pageSet(0) }}
                _hover={{
                  color: "#E5C48A",
                }}
              >
                Signup now
              </Text></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default LoginPage;