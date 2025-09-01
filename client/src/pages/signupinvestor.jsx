"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState,useEffect } from "react"
import { User, Mail, KeyRound } from 'lucide-react';
import { PasswordInput } from "../components/ui/password-input"
import SignupInvestorStore from '../store/investorform';

function SignupInvestor({pageSet}) {
  // const [Password, setPassword] = useState("")
  // const [ConfirmPassword, setConfirmPassword] = useState("")
  // const [Username, setUsername] = useState("")
const {Password, setPassword, ConfirmPassword, setConfirmPassword, Username, setUsername, CompanyEmail, setCompanyEmail}= SignupInvestorStore()
  useEffect(() => {
    const temp = localStorage.getItem("token")
    temp !== null ? pageSet(11) : null

  }, [])
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
          Sign Up
        </Text>
        <Text                                             //for investors text
          fontFamily={"Poppins"}
          color="white"
          fontSize="12px"
          letterSpacing={2}
          fontWeight={400}
          textAlign="center"
          paddingBottom="2px"
        >
          For Investors
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
          mt={2}
          gap={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}>

          <Box height="90%"                   // opacity kom wala white box
            width={"100%"}
            zIndex={3}
            display={"flex"}
            justifyContent={"flex-start"}
            padding={"20px"}
            gap={5}
            alignItems={"center"}
            flexDirection={"column"}
            bgColor={"rgba(255, 255, 255, 0.1)"}
            borderRadius={"20px"}
          >
            <Text                                             //account details text
              fontFamily={"Poppins"}
              color="white"
              fontSize="17px"
              fontWeight={300}
              textAlign="center"
            >
              Please enter the following details
            </Text>

            <InputGroup startElement={<User color="white" />}        // full name input
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
                placeholder='Full Name'
                border={"1px solid #FFF"}
                onChange={
                  (e) => {
                    const value = e.target.value;
                    const onlyLetters = /^[A-Za-z\s]+$/.test(value);
                    toast.dismiss();
                    if (onlyLetters || value === "") {
                      setUsername(value);
                    } else {
                      toast.error("Full name should only contain letters.");

                    }
                  }
                }
              /></InputGroup>

            <InputGroup startElement={<Mail color="white" />}        // firm email input
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
                placeholder='Firm Email'
                border={"1px solid #FFF"}
                onChange={(e)=>setCompanyEmail(e.target.value)}
                /></InputGroup>


            <InputGroup startElement={<KeyRound color="white" />}        // Password input
              height={"12%"}
              width={"80%"}
              display={"flex"}
              justifyContent={"left"}
              alignItems={"center"}
            >
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

            <InputGroup startElement={<KeyRound color="white" />}        // confirm Password input
              height={"12%"}
              width={"80%"}
              display={"flex"}
              justifyContent={"left"}
              alignItems={"center"}>
              <PasswordInput
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                display={"flex"}
                bgColor={"rgba(255, 255, 255, 0.1)"}
                color={"white"}
                fontFamily={"Poppins"}
                placeholder='Confirm Password'
                border={"1px solid #FFF"}
              />
            </InputGroup>

            <Button                                               //next button
            onClick={() => { pageSet(5) }}
              width="200px"
              color="#011F3C"
              borderRadius={"10px"}
              _hover={{
                backgroundColor: "#E5C48A",
                color: "#011F3C",
                borderColor: "#E5C48A",
              }}
              transition="all 0.5s ease">    Next  </Button>
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
                Already have an account?
              </Text>
              <Text                                             //login now text nicher ta
                fontFamily={"Poppins"}
                color="white"
                fontSize="12px"
                fontWeight={600}
                textAlign="center"
                onClick={() => { pageSet(3) }}
                _hover={{
                  color: "#E5C48A",
                }}
              >
                Login now
              </Text></Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default SignupInvestor;