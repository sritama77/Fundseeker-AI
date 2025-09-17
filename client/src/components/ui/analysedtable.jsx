"use client";
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Stack, Table, Spinner, VStack } from "@chakra-ui/react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useState, useEffect } from "react";
import { CirclePlus } from 'lucide-react';
import AnalyzedTableStore from "../../store/analyze";
import UserDetails from "../../store/userform";

function AnalysedTableComponent({ pageSet, currentPage }) {
    const { userid, setUserid, isMatched, setIsMatched, AnalysedMatch, setAnalysedMatch, refresh, setRefresh } = AnalyzedTableStore()
    const { user, setUser } = UserDetails()
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);

    const loadingTexts = [
        "Loading...",
        "Looking through your specifications...",
        "Curating the list of best matches for you...",
        "Almost there..."
    ];

    useEffect(() => {
        const token = localStorage.getItem("token")
        token ? setUserid(token) : setUserid(null)
    }, [])

    // Cycle through loading texts
    useEffect(() => {
        if (!isMatched) {
            const interval = setInterval(() => {
                setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
            }, 4000); 

            return () => clearInterval(interval);
        }
    }, [isMatched, loadingTexts.length]);

    async function AnalayseModelHandler() {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/modelanalysis`, {
            "UserId": userid,
            "isStartup": user?.StartupName ? true : false
        })

        if (res?.data?.Success) {
            console.log(res?.data?.result)
            setIsMatched(true)
            setAnalysedMatch(res?.data?.result)
        }
    }

    useEffect(() => {
        if (userid && refresh) {
            AnalayseModelHandler()
            setRefresh(false)
        }
    }, [userid, refresh])

    // Check if current user is a startup (will show investor data with title)
    const isStartupUser = user?.StartupName ? true : false;

    // Function to save connection to localStorage
    const handleSaveConnection = (item) => {
        try {
            // Get existing saved connections from localStorage
            const existingSavedConnections = JSON.parse(localStorage.getItem('savedConnections') || '[]');
            
            // Create a standardized connection object
            const connectionToSave = {
                id: Date.now(), // Generate unique ID
                name: isStartupUser ? item?.Investor_Name : item?.Founder_Name,
                title: isStartupUser ? item?.Investor_Title : null,
                company: isStartupUser ? item?.Investor_Company : item?.Startup_Company,
                email: isStartupUser ? item?.Investor_Email : item?.Startup_Email,
                location: isStartupUser ? item?.Investor_Location : item?.Startup_Location,
                website: item?.Website || null,
                linkedin: item?.LinkedIn || null,
                facebook: item?.Facebook || null,
                twitter: item?.Twitter || null,
                savedAt: new Date().toISOString(),
                userType: isStartupUser ? 'investor' : 'startup'
            };

            // Check if connection already exists (by email)
            const alreadyExists = existingSavedConnections.some(
                conn => conn.email === connectionToSave.email
            );

            if (alreadyExists) {
                toast.error('Connection already saved!');
                return;
            }

            // Add new connection to the array
            const updatedConnections = [...existingSavedConnections, connectionToSave];
            
            // Save to localStorage
            localStorage.setItem('savedConnections', JSON.stringify(updatedConnections));
            
            // Show success message
            toast.success('Connection saved successfully!');
        } catch (error) {
            console.error('Error saving connection:', error);
            toast.error('Failed to save connection');
        }
    };

    return (
        <Box
            height={"90%"}
            width="95%"
            display="flex"
            flexDirection="row"
            gap={8}
        //bgColor="red"
        >
            <Toaster position="top-right" />
            <Box
                height="100%"
                width="60%"
                display="flex"
                flexDirection="column"
                gap={8}
                //bg="pink"
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Text
                    fontFamily={"Poppins"}
                    color="#001B60"
                    fontSize="25px"
                    fontWeight={600}
                    textAlign={"center"}
                >Here Are Your Suitable Connections</Text>
                <Box
                    height="50%"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={8}
                    justifyContent="center"
                //bg="grey"
                >
                    {
                        isMatched ? (
                            <Box
                                flex="1"
                                overflowY="auto"
                                overflowX="auto"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                            >
                                <Table.Root size="sm" variant="outline">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader fontSize="12px">Name</Table.ColumnHeader>
                                            {isStartupUser && (
                                                <Table.ColumnHeader fontSize="12px">Title</Table.ColumnHeader>
                                            )}
                                            <Table.ColumnHeader fontSize="12px">Company</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px">Email</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px">Location</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px" textAlign="center">Action</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {AnalysedMatch?.map((item, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell fontSize="12px">{isStartupUser ? item?.Investor_Name : item?.Founder_Name}</Table.Cell>
                                                {isStartupUser && (
                                                    <Table.Cell fontSize="12px">{item?.Investor_Title}</Table.Cell>
                                                )}
                                                <Table.Cell fontSize="12px">{isStartupUser ? item?.Investor_Company : item?.Startup_Company}</Table.Cell>
                                                <Table.Cell fontSize="12px">{isStartupUser ? item?.Investor_Email : item?.Startup_Email}</Table.Cell>
                                                <Table.Cell fontSize="12px">{isStartupUser ? item?.Investor_Location : item?.Startup_Location}</Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <Button
                                                        size="xs"
                                                        color="#09B285"
                                                        onClick={() => handleSaveConnection(item)}
                                                        _hover={{
                                                            bg: "#09B285",
                                                            color: "white"

                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <CirclePlus size={16} strokeWidth={1.5} />
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        ) : (
                            <Box
                                flex="1"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                minHeight="400px"
                                gap={2}
                            >
                                <VStack spacing={8}>
                                    <Spinner 
                                        color="black" 
                                        size="xl"
                                        thickness="4px"
                                        speed="0.8s"
                                        width="80px"
                                        height="80px"
                                    />
                                    <Text 
                                        color="black" 
                                        fontSize="20px"
                                        fontStyle="italic"
                                        textAlign="center"
                                        maxWidth="400px"
                                        fontWeight="400"
                                        lineHeight="1.4"
                                        transition="opacity 0.3s ease-in-out"
                                    >
                                        {loadingTexts[loadingTextIndex]}
                                    </Text>
                                </VStack>
                            </Box>
                        )
                    }

                </Box>
            </Box>
            <Box
                height="100%"
                width="40%"
                display="flex"
                flexDirection="column"
                gap={8}
                //bg="blue"
                borderRadius={"15px"}

            >
                <Image height={"100%"}
                    width={"auto"}
                    display={"flex"}
                    borderRadius={"15px"}
                    src="/businessmeet.jpg" />
            </Box>


        </Box>
    );
}

export default AnalysedTableComponent;