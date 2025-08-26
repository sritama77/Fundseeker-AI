"use client"
//import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState,useEffect } from "react"
import { CircleUserRound, Search, BarChart3, Puzzle, MessageSquare, Check, CircleSmall } from 'lucide-react';
import SideNavbar from "../components/ui/sidenavbar";
import  ViewDatabaseComponent from "../components/ui/viewdatabase"

function StartMatchingPage({ pageSet, currentPage }) {
    const [ToggleComponent,setToggleComponent] = useState(0)
    const  [StartMatching,setStartMatching] = useState(false)
    useEffect(() => {
        const temp = localStorage.getItem("token")
        temp !== null ?  null : pageSet(0)

    }, [])
    return (
        <Box
            height={"100vh"}
            width={"100%"}
            display={"flex"}
            justifyContent={"right"}
            alignItems={"center"}
            flexDirection={"row"}
            bg={"linear-gradient(to right, #0054D8 70%, #001B60 100%)"}
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
                gap={8}
            >
                <Box
                    height={"70%"}
                    width={"70%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"row"}
                    bgColor={"white"}
                    borderRadius={"20px"}
                    gap={8}
                >
                    {ToggleComponent === 0 ? (StartMatching !== true ? <>
                        <Text>StartMatching</Text>
                        
                        <Button onClick={()=>setStartMatching(true)}>Start</Button>
                        </> : <Text>analysed table here</Text> ) : ToggleComponent === 1 ? <ViewDatabaseComponent/>:null}
                </Box>
            </Box>

        </Box>
    );
}


export default StartMatchingPage;