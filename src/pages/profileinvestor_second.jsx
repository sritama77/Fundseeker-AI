"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Select, Textarea } from "@chakra-ui/react";
import { useState } from "react";

function ProfileInvestorSecond({ pageSet }) {
    const [iCheckSizeRange, setICheckSizeRange] = useState([]);
    const [isCheckSizeDropdownOpen, setIsCheckSizeDropdownOpen] = useState(false);
    const [iBioThesis, setIBioThesis] = useState("");
    const [iSyndicationPreference, setISyndicationPreference] = useState("");
    const [isSyndicationDropdownOpen, setIsSyndicationDropdownOpen] = useState(false);
    const [iTicketType, setITicketType] = useState([]);
    const [isTicketTypeDropdownOpen, setIsTicketTypeDropdownOpen] = useState(false);

    const checkSizeOptions = [
        "₹5 L - ₹20 L",
        "₹20 L - ₹40 L",
        "₹40 L - ₹60 L",
        "₹60 L - ₹80 L",
        "₹80 L - ₹1 Cr",
        "₹1 Cr+"
    ];

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

    const handleCheckSizeToggle = (size) => {
        setICheckSizeRange(prev => {
            if (prev.includes(size)) {
                return prev.filter(item => item !== size);
            } else {
                return [...prev, size];
            }
        });
    };

    const removeCheckSize = (sizeToRemove) => {
        setICheckSizeRange(prev => prev.filter(size => size !== sizeToRemove));
    };

    const handleTicketTypeToggle = (type) => {
        setITicketType(prev => {
            if (prev.includes(type)) {
                return prev.filter(item => item !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    const removeTicketType = (typeToRemove) => {
        setITicketType(prev => prev.filter(type => type !== typeToRemove));
    };

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

                            {/* Check Size Range */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={10}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Check Size Range <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Multi-Select Container */}
                                        <Box
                                            onClick={() => setIsCheckSizeDropdownOpen(!isCheckSizeDropdownOpen)}
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
                                            {iCheckSizeRange.length === 0 ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Select suitable options
                                                </Text>
                                            ) : (
                                                iCheckSizeRange.map((size) => (
                                                    <Box
                                                        key={size}
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
                                                        <Text>{size}</Text>
                                                        <Box
                                                            ml={1}
                                                            cursor="pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeCheckSize(size);
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
                                                {isCheckSizeDropdownOpen ? '▲' : '▼'}
                                            </Box>
                                        </Box>

                                        {/* Dropdown Options */}
                                        {isCheckSizeDropdownOpen && (
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
                                                {checkSizeOptions.map((size) => (
                                                    <Box
                                                        key={size}
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
                                                            handleCheckSizeToggle(size);
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
                                                            bg={iCheckSizeRange.includes(size) ? "#E5C48A" : "transparent"}
                                                        >
                                                            {iCheckSizeRange.includes(size) && (
                                                                <Text color="#011F3C" fontSize="10px" fontWeight="bold">
                                                                    ✓
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Text>{size}</Text>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Field.Root>
                            </Box>

                            {/* Ticket Type */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={20}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Ticket Type <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Multi-Select Container */}
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
                                            {iTicketType.length === 0 ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Select suitable options
                                                </Text>
                                            ) : (
                                                iTicketType.map((type) => (
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

                                        {/* Dropdown Options */}
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
                                                            bg={iTicketType.includes(type) ? "#E5C48A" : "transparent"}
                                                        >
                                                            {iTicketType.includes(type) && (
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

                            {/* Bio / Investment Thesis */}
                            <Box height={["100%"]} width={["90%"]} display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={10}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Bio / Investment Thesis <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Textarea
                                        placeholder="We focus on early-stage cleantech startups."
                                        value={iBioThesis}
                                        onChange={(e) => setIBioThesis(e.target.value)}
                                        maxLength={200}
                                        height="100%"
                                        width="100%"
                                        bgColor="rgba(255, 255, 255, 0.1)"
                                        color="white"
                                        fontFamily="Poppins"
                                        border="1px solid #FFF"
                                        resize="none"
                                    />
                                    <Text color="rgba(255, 255, 255, 0.7)" fontSize="11px" mt={1}>
                                        eg : Make it concise but informative. ({iBioThesis.length}/200)
                                    </Text>
                                </Field.Root>
                            </Box>

                            {/* Syndication Preference */}
                            <Box height={["100%"]} width={["100%"]} display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={20}>
                                <Field.Root required style={{ height: "80%" }}>
                                    <Field.Label color="white" fontFamily="Poppins">
                                        Syndication Preference <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Box position="relative">
                                        {/* Custom Single-Select Container */}
                                        <Box
                                            onClick={() => setIsSyndicationDropdownOpen(!isSyndicationDropdownOpen)}
                                            height="100%"
                                            minHeight="50px"
                                            width="200%"
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
                                            {iSyndicationPreference === "" ? (
                                                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px">
                                                    Select suitable option
                                                </Text>
                                            ) : (
                                                <Text color="white" fontSize="14px">
                                                    {iSyndicationPreference}
                                                </Text>
                                            )}
                                            <Box ml="auto" fontSize="12px">
                                                {isSyndicationDropdownOpen ? '▲' : '▼'}
                                            </Box>
                                        </Box>

                                        {/* Dropdown Options */}
                                        {isSyndicationDropdownOpen && (
                                            <Box
                                                position="absolute"
                                                bottom="100%"
                                                left={0}
                                                right={0}
                                                bg="rgba(3, 63, 121, 0.95)"
                                                border="1px solid #FFF"
                                                borderRadius="md"
                                                maxHeight="150px"
                                                overflowY="auto"
                                                zIndex={1000}
                                                mb={1}
                                                width="90%"
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
                                                            setISyndicationPreference(option);
                                                            setIsSyndicationDropdownOpen(false);
                                                        }}
                                                        bg={iSyndicationPreference === option ? "rgba(229, 196, 138, 0.3)" : "transparent"}
                                                    >
                                                        <Text>{option}</Text>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Field.Root>
                            </Box>

                        </Box>

                        <Button                                               //sign up button
                            width="200px"
                            color="#011F3C"
                            borderRadius={"10px"}
                            _hover={{
                                backgroundColor: "#E5C48A",
                                color: "#011F3C",
                                borderColor: "#E5C48A",
                            }}
                            transition="all 0.5s ease">    Sign Up  </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ProfileInvestorSecond;