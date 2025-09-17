"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { CircleUserRound, Search, BarChart3, Puzzle, MessageSquare, Check, CircleSmall, PencilLine, WandSparkles, Handshake } from 'lucide-react';
import SideNavbar from "../components/ui/sidenavbar";
import ViewDatabaseComponent from "../components/ui/viewdatabase"
import AnalysedTableComponent from "../components/ui/analysedtable"
import ViewProfileComponent from "../components/ui/startup_profileinfo"

function StartMatchingPage({ pageSet, currentPage }) {
    const [ToggleComponent, setToggleComponent] = useState(0)
    const [StartMatching, setStartMatching] = useState(false)
    useEffect(() => {
        const temp = localStorage.getItem("token")
        temp !== null ? null : pageSet(0)

    }, [])
    return (
        <Box
            height={"100vh"}
            width={"100%"}
            display={"flex"}
            justifyContent={"right"}
            alignItems={"center"}
            flexDirection={"row"}
            bg={"linear-gradient(to right, #0054D8 50%, #001B60 100%)"}
            gap={30}
        >
            <SideNavbar currentPage={ToggleComponent} pageSet={setToggleComponent} LogoutRedirect={pageSet} />
            <Box
                height={"100%"}
                width={"80%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
                //bgColor={"white"}
                gap={12}
            >
                <Box
                    height={"80%"}
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"row"}
                    bgColor={"white"}
                    borderRadius={"20px"}
                    gap={8}
                >
                    {ToggleComponent === 0 ? (StartMatching !== true ? <>
                        <Box
                            height={"90%"}
                            width={"90%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"left"}
                            flexDirection={"row"}
                            //bgColor={"red"}
                            gap={10}
                        >
                            <Box
                                height="100%"
                                width="60%"
                                display="flex"
                                flexDirection="column"
                                gap={8}
                                //bg="pink"
                                alignItems={"left"}
                                justifyContent={"center"}
                            >
                                <Text
                                    fontFamily={"Poppins"}
                                    color="#001B60"
                                    fontSize="27px"
                                    fontWeight={600}
                                    textAlign={"left"}
                                >Smart Matching Starts Here!</Text>
                                <Text
                                    fontFamily={"Poppins"}
                                    color="black"
                                    fontSize="16px"
                                    fontWeight={400}
                                    textAlign={"left"}
                                    fontStyle="italic"
                                >Get AI-driven recommendations tailored to your goals. Whether you're a startup seeking funding or an investor looking for the next big opportunity, we've got you covered.
                                </Text>
                                <Box
                                    height={"50%"}
                                    width={"100%"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"left"}
                                    flexDirection={"column"}
                                    //bgColor={"blue"}
                                    gap={1}
                                >
                                    <Text
                                        fontFamily={"Poppins"}
                                        color="black"
                                        fontSize="22px"
                                        fontWeight={500}
                                        textAlign={"left"}
                                    >Steps:
                                    </Text>
                                    <Box
                                        height={"20%"}
                                        width={"100%"}
                                        display={"flex"}
                                        justifyContent={"left"}
                                        alignItems={"center"}
                                        flexDirection={"row"}
                                        //bgColor={"pink"}
                                        gap={3}
                                        paddingLeft={2}
                                    >
                                        <PencilLine
                                            size={20}
                                            color="#001B60"
                                            strokeWidth={2}
                                        />
                                        <Text
                                            fontFamily={"Poppins"}
                                            color="black"
                                            fontSize="18px"
                                            fontWeight={400}
                                            textAlign={"left"}
                                        >Make sure your profile details are correct & complete.
                                        </Text>
                                    </Box>
                                    <Box
                                        height={"20%"}
                                        width={"100%"}
                                        display={"flex"}
                                        justifyContent={"left"}
                                        alignItems={"center"}
                                        flexDirection={"row"}
                                        //bgColor={"pink"}
                                        gap={3}
                                        paddingLeft={2}
                                    >
                                        <WandSparkles
                                            size={20}
                                            color="#001B60"
                                            strokeWidth={2}
                                        />
                                        <Text
                                            fontFamily={"Poppins"}
                                            color="black"
                                            fontSize="18px"
                                            fontWeight={400}
                                            textAlign={"left"}
                                        >"Start Matching" to generate matches with just a click.
                                        </Text>
                                    </Box>
                                    <Box
                                        height={"20%"}
                                        width={"100%"}
                                        display={"flex"}
                                        justifyContent={"left"}
                                        alignItems={"center"}
                                        flexDirection={"row"}
                                        //bgColor={"pink"}
                                        gap={3}
                                        paddingLeft={2}
                                    >
                                        <Handshake
                                            size={20}
                                            color="#001B60"
                                            strokeWidth={2}
                                        />
                                        <Text
                                            fontFamily={"Poppins"}
                                            color="black"
                                            fontSize="18px"
                                            fontWeight={400}
                                            textAlign={"left"}
                                        >Explore, Review & Connect instantly.
                                        </Text>
                                    </Box>
                                    <Box
                                        height={"30%"}
                                        width={"100%"}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        flexDirection={"column"}
                                        //bgColor={"blue"}
                                        gap={3}
                                    >
                                        <Button                                               // button
                                            width={"350px"}
                                            height={"50px"}
                                            backgroundColor={"#004ECA"}
                                            color={"white"}
                                            borderRadius={"10px"}
                                            fontFamily={"Poppins"}
                                            display={"flex"}
                                            justifyContent={"center"}
                                            alignContent={"center"}
                                            fontSize={"16px"}
                                            onClick={() => setStartMatching(true)}

                                            _hover={{
                                                backgroundColor: "#E5C48A",
                                                color: "#011F3C",
                                            }}
                                            transition="all 0.5s ease">Start Matching</Button></Box>
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



                    </> : <AnalysedTableComponent />) : (ToggleComponent === 1 ? <ViewDatabaseComponent /> : ToggleComponent === 5 ? <ViewProfileComponent/> : null)}
                </Box>
            </Box>

        </Box>
    );
}
export default StartMatchingPage;