"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Select } from "@chakra-ui/react";
import { useState,useEffect } from "react"
import SignupStartupStore from "../store/startupform";

function ProfileStartupFirst({ pageSet }) {

    const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
    const { FounderName, setFounderName, StartupWebsiteUrl, setStartupWebsiteUrl, Location, setLocation, SocialMediaLink, setSocialMediaLink, CurrentStage, setCurrentStage, StartupIndustryCategories, setStartupIndustryCategories, handleIndustryToggle, removeIndustry } = SignupStartupStore()

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

    // const handleIndustryToggle = (industry) => {
    //     setStartupIndustryCategories(prev => {
    //         if (prev.includes(industry)) {
    //             return prev.filter(item => item !== industry);
    //         } else {
    //             return [...prev, industry];
    //         }
    //     });
    // };

    // const removeIndustry = (industryToRemove) => {
    //     setStartupIndustryCategories(prev => prev.filter(industry => industry !== industryToRemove));
    // };
    useEffect(() => {
        const temp = localStorage.getItem("token")
        temp !== null ? pageSet(11) : null

    }, [])

    const validateUrl = (url) => {
        return url.startsWith("http://") || url.startsWith("https://")
    }

    const handleNextClick = () => {
        if (!FounderName.trim()) {
            return toast.error("Please enter Founder Name")
        }
        if (!StartupWebsiteUrl.trim()) {
            return toast.error("Please enter Website URL")
        }
        if (!validateUrl(StartupWebsiteUrl)) {
            return toast.error("Links should start with http/https")
        }
        if (StartupIndustryCategories.length === 0) {
            return toast.error("Please select at least one industry")
        }
        if (!SocialMediaLink.trim()) {
            return toast.error("Please enter Social Media Link")
        }
        if (!validateUrl(SocialMediaLink)) {
            return toast.error("Links should start with http/https")
        }
        if (!Location.trim()) {
            return toast.error("Please enter Location")
        }
        if (!CurrentStage) {
            return toast.error("Please select Current Stage")
        }

        pageSet(6)
    }

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

                            {/* Founder Name */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Founder Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="Enter full name"
                                        value={FounderName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const onlyLetters = /^[A-Za-z\s]+$/.test(value);
                                            if (onlyLetters || value === "") {
                                                setFounderName(value);
                                            }
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

                            {/* Website URL */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Website URL (Should start with http/https) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. https://greentech.in"
                                        value={StartupWebsiteUrl}
                                        onChange={(e) => setStartupWebsiteUrl(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                </Field.Root>
                            </Box>

                            {/* Industry/Sector*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Industry/Sector (Try not to choose more than 3) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Multi-Select Container */}
                                        <Box
                                            onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                                            height="100%"
                                            minHeight="50px"
                                            width="90%"
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
                                            {StartupIndustryCategories?.length === 0 ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Select industries
                                                </Text>
                                            ) : (
                                                StartupIndustryCategories?.map((industry) => (
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
                                                            x
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
                                                width="90%"
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
                                                            console.log(StartupIndustryCategories);
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
                                                            bg={StartupIndustryCategories.includes(industry) ? "#E5C48A" : "transparent"}
                                                        >
                                                            {StartupIndustryCategories.includes(industry) && (
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

                            {/* Social Media URL */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        LinkedIn / Twitter / Instagram (Link to Company's profile) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. https://linkedin.com/in/founder"
                                        value={SocialMediaLink}
                                        onChange={(e) => setSocialMediaLink(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                    />
                                </Field.Root>
                            </Box>

                            {/* Location*/}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Location (City, Country) <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        placeholder="e.g. Bengaluru, India"
                                        value={Location}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setLocation(value);
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

                            {/* Current Stage */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"} >
                                <Field.Root required style={{ height: "70%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Current Stage <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box
                                        as="select"
                                        value={CurrentStage}
                                        onChange={(e) => setCurrentStage(e.target.value)}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        borderRadius="md"
                                        px={3}
                                        cursor="pointer"
                                        _focus={{
                                            outline: "none",
                                            borderColor: "white"
                                        }}
                                        sx={{
                                            option: {
                                                backgroundColor: "#033F79",
                                                color: "black",
                                                fontFamily: "Poppins"
                                            }
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select stage
                                        </option>
                                        <option value="pre-seed">
                                            Pre-Seed Stage - Idea/concept, minimal product, early small funding.
                                        </option>
                                        <option value="seed">
                                            Seed Stage - Early product development & market research.
                                        </option>
                                        <option value="early-series-a">
                                            Early Stage / Series A - Product launched, initial traction, scaling begins.
                                        </option>
                                        <option value="growth-stage">
                                            Growth Stage (Series B, C, D…) - Strong market presence, revenue growth.
                                        </option>
                                        <option value="expansion-late">
                                            Expansion / Late Stage - Mature operations, large expansion or pre-IPO prep.
                                        </option>
                                        <option value="pre-ipo">
                                            Pre-IPO Stage - Preparing to go public.
                                        </option>
                                        <option value="ipo">
                                            IPO - Public listing.
                                        </option>
                                        <option value="post-ipo">
                                            Post-IPO / Maturity - Publicly traded, focusing on stability & innovation.
                                        </option>
                                    </Box>
                                </Field.Root>
                            </Box>
                        </Box>

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

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ProfileStartupFirst;