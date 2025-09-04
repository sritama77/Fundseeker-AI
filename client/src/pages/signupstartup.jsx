"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState,useEffect } from "react"
import { User, Mail, KeyRound } from 'lucide-react';
import { PasswordInput } from "../components/ui/password-input"
import  SignupStartupStore  from '../store/startupform';

function SignupStartup({ pageSet }) {
  // const [Password, setPassword] = useState("")
  // const [ConfirmPassword, setConfirmPassword] = useState("")
  // const [StartupName, setStartupName] = useState("")
  // const [CompanyEmail, setCompanyEmail] = useState("")
  const {Password,setPassword,ConfirmPassword,setConfirmPassword,StartupName, setStartupName,CompanyEmail, setCompanyEmail} = SignupStartupStore()
  const [isEmailValid, setIsEmailValid] = useState(true)

  useEffect(() => {
    const temp = localStorage.getItem("token")
    temp !== null ? pageSet(11) : null

  }, [])

  const validateEmail = (email) => {
    return email.includes("@gmail.com")
  }

  const handleNextClick = () => {
    if (!StartupName.trim()) {
      return toast.error("Please enter Startup Name")
    }
    if (!validateEmail(CompanyEmail)) {
      return toast.error("Enter a valid email")
    }
    if (!Password.trim()) {
      return toast.error("Please enter Password")
    }
    if (!ConfirmPassword.trim()) {
      return toast.error("Please confirm Password")
    }
    if (Password !== ConfirmPassword) {
      return toast.error("Passwords do not match")
    }

    pageSet(4)
    console.log({
      "StartupName":StartupName,
      "CompanyEmail":CompanyEmail,
      "Password":Password,
      "ConfirmPassword":ConfirmPassword
    })
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

      {/* <Image position={"absolute"}  //bg image
        top={0} left={0} 
        zIndex={1} 
        height="100%" 
        width={"100%"} 
        src="/goldenlines.png"/> */}

      <Box height="95%"
        width={"60%"}
        zIndex={1}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      //bgColor={"red"}
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
        <Text                                             //for startups text
          fontFamily={"Poppins"}
          color="white"
          fontSize="12px"
          letterSpacing={2}
          fontWeight={400}
          textAlign="center"
          paddingBottom="2px"
        >
          For Startups
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
          //bgColor={"aqua"}
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
                placeholder='Startup Name'
                border={"1px solid #FFF"}
                value={StartupName}
                onChange={
                  (e) => {
                    const value = e.target.value;
                    setStartupName(value);
                  }
                }
              /></InputGroup>

            <InputGroup startElement={<Mail color="white" />}        // company email input
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
                placeholder='Company Email'
                border={isEmailValid ? "1px solid #FFF" : "1px solid red"}
                value={CompanyEmail}
                onChange={
                  (e) => {
                    const value = e.target.value;
                    setCompanyEmail(value);
                    setIsEmailValid(validateEmail(value) || value === "");
                  }}
              />
            </InputGroup>


            <InputGroup startElement={<KeyRound color="white" />}        // password input
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

            <InputGroup startElement={<KeyRound color="white" />}        // confirm password input
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
              onClick={handleNextClick}
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
              //bgColor={"red"}
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
export default SignupStartup;