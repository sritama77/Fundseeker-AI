"use client";
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Stack, Table } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { CirclePlus } from 'lucide-react';


function AnalysedTableComponent({ pageSet, currentPage }) {
    const [userid, setUserid] = useState(null)
    const [isMatched, setIsMatched] = useState(false)
    const [AnalysedMatch, setAnalysedMatch] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        token ? setUserid(token) : setUserid(null)
    }, [])




    async function AnalayseModelHandler() {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/modelanalysis`, {
            "UserId": userid
        })

        if (res?.data?.Success) {
            console.log(res?.data?.result)
            setIsMatched(true)
            setAnalysedMatch(res?.data?.result)
        }
    }


    useEffect(() => {
        if (userid) {
            AnalayseModelHandler()
        }
    }, [userid])


    return (
        <Box
            height={"90%"}
            width="95%"
            display="flex"
            flexDirection="row"
            gap={8}
        //bgColor="red"
        >
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
                                            <Table.ColumnHeader fontSize="12px">Title</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px">Company</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px">Email</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px">Location</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize="12px" textAlign="center">Action</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {AnalysedMatch?.map((item, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell fontSize="12px">{item?.Investor_Name}</Table.Cell>
                                                <Table.Cell fontSize="12px">{item?.Investor_Title}</Table.Cell>
                                                <Table.Cell fontSize="12px">{item?.Investor_Company}</Table.Cell>
                                                <Table.Cell fontSize="12px">{item?.Investor_Email}</Table.Cell>
                                                <Table.Cell fontSize="12px">{item?.Investor_Location}</Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <Button
                                                        size="xs"
                                                        color="#09B285"
                                                        onClick={() => handleDelete(item.id)}
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
                        ) : <Text>Loadingggg</Text>
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
