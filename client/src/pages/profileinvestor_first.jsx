"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Select } from "@chakra-ui/react";
import { useState } from "react"
import SignupInvestorStore from '../store/investorform';
import { useEffect } from 'react';

function ProfileInvestorFirst({ pageSet }) {
    // const [FirmName, setFirmName] = useState("");
    // const [InvestorWebsite, setInvestorWebsite] = useState("");
    // const [InvestorLocation, setInvestorLocation] = useState("");
    // const [InvestorSocialMedia, setInvestorSocialMedia] = useState("");
    // const [SelectedIndustries, setSelectedIndustries] = useState([]);
    // const [SelectedStages, setSelectedStages] = useState([]);
    const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
    const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);

    const {FirmName, setFirmName, InvestorWebsite, setInvestorWebsite, InvestorLocation, setInvestorLocation,
        InvestorSocialMedia, setInvestorSocialMedia, SelectedIndustries, setSelectedIndustries, SelectedStages, setSelectedStages,
        handleIndustryToggle,removeIndustry,handleStageToggle,removeStage
    }=SignupInvestorStore()

    const industryOptions = [
        "Technology",
        "Fintech",
        "Healthcare & Life Sciences",
        "Energy & Cleantech",
        "Consumer Goods & Retail",
        "Media & Entertainment",
        "Real Estate & PropTech",
        "Transportation & Mobility",
        "Agriculture & AgriTech",
        "Industrial & Manufacturing",
        "Education & EdTech",
        "Other"
    ];

    const stageOptions = [
        "Pre-Seed Stage",
        "Seed Stage",
        "Early Stage / Series A",
        "Growth Stage (Series B, C, D…)",
        "Expansion / Late Stage",
        "Pre-IPO Stage",
        "IPO",
        "Post-IPO / Maturity"
    ];

    // const handleIndustryToggle = (industry) => {
    //     setSelectedIndustries(prev => {
    //         if (prev.includes(industry)) {
    //             return prev.filter(item => item !== industry);
    //         } else {
    //             return [...prev, industry];
    //         }
    //     });
    // };

    // const removeIndustry = (industryToRemove) => {
    //     setSelectedIndustries(prev => prev.filter(industry => industry !== industryToRemove));
    // };

    // const handleStageToggle = (stage) => {
    //     setSelectedStages(prev => {
    //         if (prev.includes(stage)) {
    //             return prev.filter(item => item !== stage);
    //         } else {
    //             return [...prev, stage];
    //         }
    //     });
    // };

    // const removeStage = (stageToRemove) => {
    //     setSelectedStages(prev => prev.filter(stage => stage !== stageToRemove));
    // };

    useEffect(() => {
        const temp = localStorage.getItem("token")
        temp !== null ? pageSet(11) : null

    }, [])

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
                    For Investors
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
                        width={"120%"}
                        zIndex={3}
                        display={"flex"}
                        justifyContent={"flex-start"}
                        padding={"20px"}
                        gap={2}
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
                        >

                            {/* Firm Name */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Firm Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="VC firm or angel network name"
                                        value={FirmName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFirmName(value);
                                        }}
                                        height="100%"
                                        width="90%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                </Field.Root>
                            </Box>

                            {/* Role / Title */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Role / Title (Position in firm) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. Partner, Angel Investor"
                                        value={InvestorWebsite}
                                        onChange={(e) => setInvestorWebsite(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                </Field.Root>
                            </Box>

                            {/* Sector Interests - Multi-Select Dropdown (made to match Preferred Stages) */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Sector Interests <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Multi-Select Container */}
                                        <Box
                                            onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                                            height="100%"
                                            minHeight="50px"
                                            width="100%"
                                            bgColor="rgba(255, 255, 255, 0.1)"
                                            color="white"
                                            fontFamily="Poppins"
                                            border="1px solid #FFF"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            cursor="pointer"
                                            display="flex"
                                            flexWrap="wrap"
                                            alignItems="center"
                                            gap={2}
                                            _focus={{
                                                outline: "none",
                                                borderColor: "white"
                                            }}
                                        >
                                            {SelectedIndustries.length === 0 ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Fintech, SaaS, etc.
                                                </Text>
                                            ) : (
                                                SelectedIndustries.map((industry) => (
                                                    <Box
                                                        key={industry}
                                                        display="flex"
                                                        alignItems="center"
                                                        bg="rgba(229, 196, 138, 0.8)"
                                                        color="#011F3C"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                        fontSize="12px"
                                                        fontWeight={500}
                                                    >
                                                        <Text>{industry}</Text>
                                                        <Box
                                                            ml={1}
                                                            cursor="pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeIndustry(industry);
                                                            }}
                                                            _hover={{ color: "red.500" }}
                                                            fontWeight="bold"
                                                        >
                                                            ×
                                                        </Box>
                                                    </Box>
                                                ))
                                            )}
                                            <Box ml="auto" fontSize="12px">
                                                {isIndustryDropdownOpen ? '▲' : '▼'}
                                            </Box>
                                        </Box>

                                        {/* Dropdown Options */}
                                        {isIndustryDropdownOpen && (
                                            <Box
                                                position="absolute"
                                                top="100%"
                                                left={0}
                                                right={0}
                                                bg="rgba(3, 63, 121, 0.95)"
                                                border="1px solid #FFF"
                                                borderRadius="md"
                                                maxHeight="150px"
                                                overflowY="auto"
                                                zIndex={1000}
                                                mt={1}
                                            >
                                                {industryOptions.map((industry) => (
                                                    <Box
                                                        key={industry}
                                                        px={3}
                                                        py={2}
                                                        cursor="pointer"
                                                        color="white"
                                                        fontFamily="Poppins"
                                                        fontSize="14px"
                                                        display="flex"
                                                        alignItems="center"
                                                        _hover={{
                                                            bg: "rgba(229, 196, 138, 0.2)"
                                                        }}
                                                        onClick={() => {
                                                            handleIndustryToggle(industry);
                                                        }}
                                                    >
                                                        <Box
                                                            width="16px"
                                                            height="16px"
                                                            border="1px solid white"
                                                            borderRadius="sm"
                                                            mr={2}
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            bg={SelectedIndustries.includes(industry) ? "#E5C48A" : "transparent"}
                                                        >
                                                            {SelectedIndustries.includes(industry) && (
                                                                <Text color="#011F3C" fontSize="10px" fontWeight="bold">
                                                                    ✓
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Text>{industry}</Text>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Field.Root>
                            </Box>

                            {/* Preferred Stages -*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Preferred Stages <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Multi-Select Container */}
                                        <Box
                                            onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
                                            height="100%"
                                            minHeight="50px"
                                            width="100%"
                                            bgColor="rgba(255, 255, 255, 0.1)"
                                            color="white"
                                            fontFamily="Poppins"
                                            border="1px solid #FFF"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            cursor="pointer"
                                            display="flex"
                                            flexWrap="wrap"
                                            alignItems="center"
                                            gap={2}
                                            _focus={{
                                                outline: "none",
                                                borderColor: "white"
                                            }}
                                        >
                                            {SelectedStages.length === 0 ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Pre-seed, Seed, Series A
                                                </Text>
                                            ) : (
                                                SelectedStages.map((stage) => (
                                                    <Box
                                                        key={stage}
                                                        display="flex"
                                                        alignItems="center"
                                                        bg="rgba(229, 196, 138, 0.8)"
                                                        color="#011F3C"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                        fontSize="12px"
                                                        fontWeight={500}
                                                    >
                                                        <Text>{stage.split(' - ')[0]}</Text>
                                                        <Box
                                                            ml={1}
                                                            cursor="pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeStage(stage);
                                                            }}
                                                            _hover={{ color: "red.500" }}
                                                            fontWeight="bold"
                                                        >
                                                            ×
                                                        </Box>
                                                    </Box>
                                                ))
                                            )}
                                            <Box ml="auto" fontSize="12px">
                                                {isStageDropdownOpen ? '▲' : '▼'}
                                            </Box>
                                        </Box>

                                        {/* Dropdown Options */}
                                        {isStageDropdownOpen && (
                                            <Box
                                                position="absolute"
                                                top="100%"
                                                left={0}
                                                right={0}
                                                bg="rgba(3, 63, 121, 0.95)"
                                                border="1px solid #FFF"
                                                borderRadius="md"
                                                maxHeight="200px"
                                                overflowY="auto"
                                                zIndex={1000}
                                                mt={1}
                                            >
                                                {stageOptions.map((stage) => (
                                                    <Box
                                                        key={stage}
                                                        px={3}
                                                        py={2}
                                                        cursor="pointer"
                                                        color="white"
                                                        fontFamily="Poppins"
                                                        fontSize="14px"
                                                        display="flex"
                                                        alignItems="center"
                                                        _hover={{
                                                            bg: "rgba(229, 196, 138, 0.2)"
                                                        }}
                                                        onClick={() => {
                                                            handleStageToggle(stage);
                                                        }}
                                                    >
                                                        <Box
                                                            width="16px"
                                                            height="16px"
                                                            border="1px solid white"
                                                            borderRadius="sm"
                                                            mr={2}
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            bg={SelectedStages.includes(stage) ? "#E5C48A" : "transparent"}
                                                        >
                                                            {SelectedStages.includes(stage) && (
                                                                <Text color="#011F3C" fontSize="10px" fontWeight="bold">
                                                                    ✓
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Text>{stage}</Text>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Field.Root>
                            </Box>

                            {/* Geographic Focus*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Geographic Focus <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. India, Southeast Asia"
                                        value={InvestorLocation}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setInvestorLocation(value);
                                        }}
                                        height="100%"
                                        width="90%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                    <Field.HelperText />
                                </Field.Root>
                            </Box>

                            {/* Fund Website URL*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Fund Website URL (Should start with http/https) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. https://alphaventures.com"
                                        value={InvestorSocialMedia}
                                        onChange={(e) => setInvestorSocialMedia(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                </Field.Root>
                            </Box>

                        </Box>

                        <Button                                               //next button
                            onClick={() => { pageSet(7) }}
                            width="200px"
                            color="#011F3C"
                            borderRadius={"10px"}
                            _hover={{
                                backgroundColor: "#E5C48A",
                                color: "#011F3C",
                                borderColor: "#E5C48A",
                            }}
                            transition="all 0.5s ease">    Next  </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ProfileInvestorFirst;