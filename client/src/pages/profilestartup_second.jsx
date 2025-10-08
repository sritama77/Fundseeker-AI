"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Select, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SignupStartupStore from "../store/startupform";
import axios from "axios"


function ProfileStartupSecond({ pageSet }) {
    const [isFundingDropdownOpen, setIsFundingDropdownOpen] = useState(false);

    const { BriefPitch, setBriefPitch, ProblemStatement, setProblemStatement, Solution, setSolution, BusinessModel, setBusinessModel,
        FundingRequirementINR, setFundingRequirementINR, Competitors, setCompetitors, FounderName, setFounderName, StartupWebsiteUrl, setStartupWebsiteUrl,
        Location, setLocation, SocialMediaLink, setSocialMediaLink, CurrentStage, setCurrentStage, StartupIndustryCategories, setStartupIndustryCategories,
        Password, setPassword, ConfirmPassword, setConfirmPassword, StartupName, setStartupName, CompanyEmail, setCompanyEmail } = SignupStartupStore()

    const fundingOptions = [
        "₹5 L - ₹20 L",
        "₹20 L - ₹40 L",
        "₹40 L - ₹60 L",
        "₹60 L - ₹80 L",
        "₹80 L - ₹1 Cr",
        "₹1 Cr+"
    ];

    async function StartUpSignupHandler() {
        // Validate all fields before proceeding
        if (!BriefPitch.trim()) {
            return toast.error("Please enter Brief Pitch")
        }
        if (!ProblemStatement.trim()) {
            return toast.error("Please enter Problem Statement")
        }
        if (!Solution.trim()) {
            return toast.error("Please enter Solution")
        }
        if (!BusinessModel.trim()) {
            return toast.error("Please enter Business Model")
        }
        if (!FundingRequirementINR.trim()) {
            return toast.error("Please select Funding Requirement")
        }
        if (!Competitors.trim()) {
            return toast.error("Please enter Competitors & Differentiation")
        }

        if (Password === ConfirmPassword) {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/signupstartup`, {
                "StartupName": StartupName,
                "CompanyEmail": CompanyEmail,
                "Password": Password,
                "ConfirmPassword": ConfirmPassword,
                "FounderName": FounderName,
                "StartupWebsiteUrl": StartupWebsiteUrl,
                "Location": Location,
                "SocialMediaLink": SocialMediaLink,
                "CurrentStage": CurrentStage,
                "StartupIndustryCategories": StartupIndustryCategories,
                "BriefPitch": BriefPitch,
                "ProblemStatement": ProblemStatement,
                "Solution": Solution,
                "BusinessModel": BusinessModel,
                "FundingRequirementINR": FundingRequirementINR,
                "Competitors": Competitors,

            })


            if (res.data.message === "success") {
                setTimeout(() => {
                    pageSet(11)
                }, 1500)
                return toast.success("User Successfully added")
            }
            else {
                return toast.error("Error signup")
            }
        }


        setTimeout(() => {
            pageSet(1)
        }, 1500)
        return toast.error("Passwords should match.")

    }

    useEffect(() => {
        const temp = localStorage.getItem("token")
        temp !== null ? pageSet(11) : null

    }, [])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFundingDropdownOpen && !event.target.closest('.funding-dropdown-container')) {
                setIsFundingDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFundingDropdownOpen]);

    return (
        <Box
            height={"100%"}
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
                    flex={"0 0 auto"}
                    height={"20%"}
                    width={"100%"}
                    //bgColor={"red"}
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
                    flex={"0 0 auto"}
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
                    flex={"0 0 auto"}

                >
                    For Startups
                </Text>
                <Box                                              //golden line
                    height="2px"
                    width={"100%"}
                    borderRadius="full"
                    backgroundColor={"#E5C48A"}
                    mt="4px"
                    flex={"0 0 auto"}
                />


                <Box height="100%"
                    width={"100%"}
                    zIndex={2}
                    mt={2}
                    gap={2}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                //bgColor={"red"}
                >

                    <Box height="95%"                   // opacity kom wala white box
                        width={"140%"}
                        zIndex={3}
                        display={"flex"}
                        justifyContent={"flex-start"}
                        padding={"20px"}
                        gap={1}
                        alignItems={"center"}
                        flexDirection={"column"}
                        bgColor={"rgba(255, 255, 255, 0.1)"}
                        borderRadius={"20px"}
                    >
                        <Text                                             //profile details text
                            fontFamily={"Poppins"}
                            color="white"
                            fontSize="17px"
                            fontWeight={300}
                            textAlign="center"
                            paddingBottom={2}
                        >
                            Please enter the following details to set up your profile
                        </Text>

                        <Box
                            display={"grid"}
                            height={"80%"}
                            width={"90%"}
                            gridTemplateColumns={"1fr 1fr"}
                            gridTemplateRows={"1fr 1fr 1fr"}
                            gap={4}
                        >

                            {/* Funding Requirement (INR)*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "90%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Funding Requirement (INR) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative" width="100%" className="funding-dropdown-container">
                                        {/* Custom Single-Select Container */}
                                        <Box
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsFundingDropdownOpen(!isFundingDropdownOpen);
                                            }}
                                            minHeight="40px"
                                            width="100%"
                                            bgColor="rgba(255, 255, 255, 0.1)"
                                            color="white"
                                            fontFamily="Poppins"
                                            border="1px solid #FFF"
                                            borderRadius="md"
                                            paddingX="12px"
                                            paddingY="8px"
                                            cursor="pointer"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            _hover={{
                                                bgColor: "rgba(255, 255, 255, 0.15)"
                                            }}
                                        >
                                            <Text 
                                                color={FundingRequirementINR === "" ? "rgba(255, 255, 255, 0.5)" : "white"}
                                                fontSize="14px"
                                            >
                                                {FundingRequirementINR === "" ? "e.g. ₹20 L - ₹40 L" : FundingRequirementINR}
                                            </Text>
                                            <Text fontSize="12px" marginLeft="8px">
                                                {isFundingDropdownOpen ? '▲' : '▼'}
                                            </Text>
                                        </Box>

                                        {/* Dropdown Options */}
                                        {isFundingDropdownOpen && (
                                            <Box
                                                position="absolute"
                                                top="100%"
                                                left={0}
                                                right={0}
                                                bg="rgba(3, 63, 121, 0.98)"
                                                border="1px solid #FFF"
                                                borderRadius="md"
                                                maxHeight="200px"
                                                overflowY="auto"
                                                zIndex={10000}
                                                mt={1}
                                                boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
                                            >
                                                {fundingOptions.map((option) => (
                                                    <Box
                                                        key={option}
                                                        px={3}
                                                        py={2}
                                                        cursor="pointer"
                                                        color="white"
                                                        fontFamily="Poppins"
                                                        fontSize="14px"
                                                        display="flex"
                                                        alignItems="center"
                                                        _hover={{
                                                            bg: "rgba(229, 196, 138, 0.3)"
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFundingRequirementINR(option);
                                                            setIsFundingDropdownOpen(false);
                                                        }}
                                                        bg={FundingRequirementINR === option ? "rgba(229, 196, 138, 0.3)" : "transparent"}
                                                    >
                                                        <Text>{option}</Text>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        Select your funding requirement range.
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>

                            {/* Problem Statement */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "100%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Problem Statement <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Textarea
                                        placeholder="e.g. Farmers struggle to access affordable irrigation systems."
                                        value={ProblemStatement}
                                        onChange={(e) => setProblemStatement(e.target.value)}
                                        maxLength={150}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        resize="none"
                                    />
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        Define the core problem. ({ProblemStatement.length}/150)
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>

                            {/* Solution */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "90%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Solution <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Textarea
                                        placeholder="e.g. We provide solar-powered irrigation pumps at 40% lower cost."
                                        value={Solution}
                                        onChange={(e) => setSolution(e.target.value)}
                                        maxLength={150}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        resize="none"
                                    />
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        Explain how they solve the problem. ({Solution.length}/150)
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>

                            {/* Business Model */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "100%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Business Model (Explain how revenue is generated) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Textarea
                                        placeholder="e.g. Subscription-based SaaS model charging $49/month."
                                        value={BusinessModel}
                                        onChange={(e) => setBusinessModel(e.target.value)}
                                        maxLength={150}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        resize="none"
                                    />
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        Explain how revenue is generated. ({BusinessModel.length}/150)
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>

                            {/* Brief Pitch (Tagline)*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "90%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Brief Pitch (Tagline) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. Revolutionizing clean energy for rural areas"
                                        value={BriefPitch}
                                        onChange={(e) => setBriefPitch(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        One catchy sentence.
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>

                            {/* Competitors & Differentiation */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%", width: "100%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Competitors & Differentiation (How are you unique?) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Textarea
                                        placeholder="e.g. Compete with AgriTechCo but offer faster installation and better warranty."
                                        value={Competitors}
                                        onChange={(e) => setCompetitors(e.target.value)}
                                        maxLength={150}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        resize="none"
                                    />
                                    <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                        Shows unique advantage. ({Competitors.length}/150)
                                    </Field.HelperText>
                                </Field.Root>
                            </Box>
                        </Box>

                        <Button                                               //signup button
                            width="200px"
                            color="#011F3C"
                            _hover={{
                                backgroundColor: "#E5C48A",
                                color: "#011F3C",
                                borderColor: "#E5C48A",
                            }}
                            transition="all 0.5s ease"

                            onClick={() => StartUpSignupHandler()}>    Sign Up  </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ProfileStartupSecond;