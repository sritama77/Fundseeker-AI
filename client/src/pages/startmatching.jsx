"use client"
//import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState } from "react"
import { CircleUserRound, Search, BarChart3, Puzzle, MessageSquare, Check, CircleSmall } from 'lucide-react';
import SideNavbar from "../components/ui/sidenavbar";

function StartMatchingPage({ pageSet, currentPage }) {
    return (
        <Box
            height={"100vh"}
            width={"100vw"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"row"}
            bg={"linear-gradient(to right, #0054D8 70%, #001B60 100%)"}
            gap={30}
        >
            <SideNavbar currentPage={currentPage} pageSet={pageSet} />
            <Box
                height={"50%"}
                width={"50%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
                bgColor={"white"}
                gap={8}
            ></Box>

        </Box>
    );
}

export default StartMatchingPage;