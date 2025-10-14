"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Select, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SignupInvestorStore from '../store/investorform';
import axios from 'axios';

function ProfileInvestorSecond({ pageSet }) {
    const [isTicketTypeDropdownOpen, setIsTicketTypeDropdownOpen] = useState(false);
    const [isSyndicationDropdownOpen, setIsSyndicationDropdownOpen] = useState(false);

    const { 
        check_size_min_inr, setcheck_size_min_inr, 
        check_size_max_inr, setcheck_size_max_inr,
        BioThesis, setBioThesis, 
        SyndicationPreference, setSyndicationPreference,
        TicketType, setTicketType, 
        FirmName, setFirmName, 
        InvestorWebsite, setInvestorWebsite, 
        InvestorLocation, setInvestorLocation,
        InvestorSocialMedia, setInvestorSocialMedia, 
        SelectedIndustries, setSelectedIndustries, 
        SelectedStages, setSelectedStages,
        Password, setPassword, 
        ConfirmPassword, setConfirmPassword, 
        Username, setUsername, 
        handleTicketTypeToggle, 
        removeTicketType,
        CompanyEmail, setCompanyEmail, 
        InvestorTitle, setInvestorTitle,
    } = SignupInvestorStore()

    const handleMinFundingChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            setcheck_size_min_inr("");
            return;
        }

        if (/^\d+$/.test(value)) {
            setcheck_size_min_inr(parseInt(value));
        } else {
            toast.error("Please enter numbers only");
        }
    };

    const handleMaxFundingChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            setcheck_size_max_inr("");
            return;
        }

        if (/^\d+$/.test(value)) {
            setcheck_size_max_inr(parseInt(value));
        } else {
            toast.error("Please enter numbers only");
        }
    };

    const validateForm = () => {
        if (!check_size_min_inr) {
            toast.error("Minimum Funding Offered is required");
            return false;
        }
        if (!check_size_max_inr) {
            toast.error("Maximum Funding Offered is required");
            return false;
        }
        if (parseInt(check_size_min_inr) > parseInt(check_size_max_inr)) {
            toast.error("Minimum funding cannot be greater than maximum funding");
            return false;
        }
        if (TicketType.length === 0) {
            toast.error("At least one Ticket Type must be selected");
            return false;
        }
        if (!BioThesis.trim()) {
            toast.error("Bio/Investment Thesis is required");
            return false;
        }
        if (!SyndicationPreference.trim()) {
            toast.error("Syndication Preference must be selected");
            return false;
        }
        return true;
    };

    async function InvestorSignupHandler() {
        if (!validateForm()) {
            return;
        }

        if (Password === ConfirmPassword) {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/signupinvestor`, {
                "Username": Username,
                "CompanyEmail": CompanyEmail,
                "Password": Password,
                "ConfirmPassword": ConfirmPassword,
                "FirmName": FirmName,
                "InvestorTitle": InvestorTitle,
                "InvestorWebsite": InvestorWebsite,
                "InvestorLocation": InvestorLocation,
                "InvestorSocialMedia": InvestorSocialMedia,
                "SelectedIndustries": SelectedIndustries,
                "SelectedStages": SelectedStages,
                "check_size_min_inr": check_size_min_inr,
                "check_size_max_inr": check_size_max_inr,
                "BioThesis": BioThesis,
                "SyndicationPreference": SyndicationPreference,
                "TicketType": TicketType
            })

            if (res.data.message === "success") {
                setTimeout(() => {
                    pageSet(11)
                }, 1500)
                return toast.success("User Added Successfully")
            }
            else {
                return toast.error("Error signup")
            }
        }

        setTimeout(() => {
            pageSet(2)
        }, 1500)
        return toast.error("Passwords should match")
    }

    const syndicationOptions = [
        "Lead Investor",
        "Co-Investor",
        "Open to Syndication",
        "Solo Investor",
        "No Preference"
    ];

    const ticketTypeOptions = [
        "Equity",
        "Convertible Note",
        "SAFE",
        "Debt",
        "Revenue-Based Financing",
        "Grants"
    ];

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
                <Box
                    flex={"0 0 auto"}
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

                    <Text
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
                <Text
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
                <Text
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
                <Box
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
                >
                    <Box height="90%"
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
                        <Text
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
                            height={"85%"}
                            width={"90%"}
                            gridTemplateColumns={"1fr 1fr"}
                            gap={4}
                        >
                            <Box display={"flex"} flexDirection={"column"} gap={4}>
                                {/* Ticket Type */}
                                <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <Field.Root required style={{ height: "100%", width: "90%" }}>
                                        <Field.Label color="white" fontFamily="Poppins">
                                            Ticket Type <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Box position="relative">
                                            <Box
                                                onClick={() => setIsTicketTypeDropdownOpen(!isTicketTypeDropdownOpen)}
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
                                                {TicketType.length === 0 ? (
                                                    <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                        Select suitable options
                                                    </Text>
                                                ) : (
                                                    TicketType.map((type) => (
                                                        <Box
                                                            key={type}
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
                                                            <Text>{type}</Text>
                                                            <Box
                                                                ml={1}
                                                                cursor="pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeTicketType(type);
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
                                                    {isTicketTypeDropdownOpen ? '▲' : '▼'}
                                                </Box>
                                            </Box>

                                            {isTicketTypeDropdownOpen && (
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
                                                    {ticketTypeOptions.map((type) => (
                                                        <Box
                                                            key={type}
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
                                                                handleTicketTypeToggle(type);
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
                                                                bg={TicketType.includes(type) ? "#E5C48A" : "transparent"}
                                                            >
                                                                {TicketType.includes(type) && (
                                                                    <Text color="#011F3C" fontSize="10px" fontWeight="bold">
                                                                        ✓
                                                                    </Text>
                                                                )}
                                                            </Box>
                                                            <Text>{type}</Text>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </Field.Root>
                                </Box>

                                {/* Minimum Funding Offered */}
                                <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <Field.Root required style={{ height: "100%", width: "90%" }}>
                                        <Field.Label color="white" fontFamily="Poppins">
                                            Minimum Funding Offered (INR) <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Box position="relative" width="100%">
                                            <Box
                                                position="absolute"
                                                left="12px"
                                                top="50%"
                                                transform="translateY(-50%)"
                                                color="white"
                                                fontSize="14px"
                                                fontFamily="Poppins"
                                                pointerEvents="none"
                                                zIndex={1}
                                            >
                                                ₹
                                            </Box>
                                            <Input
                                                placeholder="e.g. 500000"
                                                value={check_size_min_inr}
                                                onChange={handleMinFundingChange}
                                                paddingLeft="30px"
                                                height="40px"
                                                width="100%"
                                                bgColor="rgba(255, 255, 255, 0.1)"
                                                color="white"
                                                fontFamily="Poppins"
                                                border="1px solid #FFF"
                                            />
                                        </Box>
                                        <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                            Enter the minimum amount in INR.
                                        </Field.HelperText>
                                    </Field.Root>
                                </Box>

                                {/* Maximum Funding Offered */}
                                <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <Field.Root required style={{ height: "100%", width: "90%" }}>
                                        <Field.Label color="white" fontFamily="Poppins">
                                            Maximum Funding Offered (INR) <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Box position="relative" width="100%">
                                            <Box
                                                position="absolute"
                                                left="12px"
                                                top="50%"
                                                transform="translateY(-50%)"
                                                color="white"
                                                fontSize="14px"
                                                fontFamily="Poppins"
                                                pointerEvents="none"
                                                zIndex={1}
                                            >
                                                ₹
                                            </Box>
                                            <Input
                                                placeholder="e.g. 5000000"
                                                value={check_size_max_inr}
                                                onChange={handleMaxFundingChange}
                                                paddingLeft="30px"
                                                height="40px"
                                                width="100%"
                                                bgColor="rgba(255, 255, 255, 0.1)"
                                                color="white"
                                                fontFamily="Poppins"
                                                border="1px solid #FFF"
                                            />
                                        </Box>
                                        <Field.HelperText color="rgba(255, 255, 255, 0.7)" fontSize="11px">
                                            Enter the maximum amount in INR.
                                        </Field.HelperText>
                                    </Field.Root>
                                </Box>
                            </Box>

                            {/* Right Column */}
                            <Box display={"flex"} flexDirection={"column"} gap={4}>
                                {/* Syndication Preference */}
                                <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <Field.Root required style={{ height: "100%", width: "100%" }}>
                                        <Field.Label color="white" fontFamily="Poppins">
                                            Syndication Preference <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Box position="relative">
                                            <Box
                                                onClick={() => setIsSyndicationDropdownOpen(!isSyndicationDropdownOpen)}
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
                                                alignItems="center"
                                                gap={2}
                                                _focus={{
                                                    outline: "none",
                                                    borderColor: "white"
                                                }}
                                            >
                                                {SyndicationPreference === "" ? (
                                                    <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                        Select suitable option
                                                    </Text>
                                                ) : (
                                                    <Text color="white" fontSize="14px">
                                                        {SyndicationPreference}
                                                    </Text>
                                                )}
                                                <Box ml="auto" fontSize="12px">
                                                    {isSyndicationDropdownOpen ? '▲' : '▼'}
                                                </Box>
                                            </Box>

                                            {isSyndicationDropdownOpen && (
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
                                                    width="100%"
                                                >
                                                    {syndicationOptions.map((option) => (
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
                                                                bg: "rgba(229, 196, 138, 0.2)"
                                                            }}
                                                            onClick={() => {
                                                                setSyndicationPreference(option);
                                                                setIsSyndicationDropdownOpen(false);
                                                            }}
                                                            bg={SyndicationPreference === option ? "rgba(229, 196, 138, 0.3)" : "transparent"}
                                                        >
                                                            <Text>{option}</Text>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </Field.Root>
                                </Box>

                                {/* Bio / Investment Thesis */}
                                <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <Field.Root required style={{ height: "100%", width: "100%" }}>
                                        <Field.Label color="white" fontFamily="Poppins">
                                            Bio / Investment Thesis <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Textarea
                                            placeholder="eg : We focus on early-stage cleantech startups."
                                            value={BioThesis}
                                            onChange={(e) => setBioThesis(e.target.value)}
                                            maxLength={200}
                                            height="150px"
                                            width="100%"
                                            bgColor="rgba(255, 255, 255, 0.1)"
                                            color="white"
                                            fontFamily="Poppins"
                                            border="1px solid #FFF"
                                            resize="none"
                                        />
                                        <Text color="rgba(255, 255, 255, 0.7)" fontSize="11px" mt={1}>
                                            Make it concise but informative. ({BioThesis.length}/200)
                                        </Text>
                                    </Field.Root>
                                </Box>
                            </Box>
                        </Box>

                        <Button
                            width="200px"
                            color="#011F3C"
                            borderRadius={"10px"}
                            _hover={{
                                backgroundColor: "#E5C48A",
                                color: "#011F3C",
                                borderColor: "#E5C48A",
                            }}
                            transition="all 0.5s ease"
                            onClick={() => InvestorSignupHandler()}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ProfileInvestorSecond;