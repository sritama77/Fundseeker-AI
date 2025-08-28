"use client";
import { Box } from "@chakra-ui/react";

function AnalysedTableComponent({ pageSet, currentPage }) {
    return (
        <Box
            height="90%"
            width="95%"
            display="flex"
            flexDirection="row"
            gap={8}
            bgColor="red"
        >
            <Box
                height="100%"
                width="50%"
                display="flex"
                flexDirection="column"
                gap={8}
                bg="pink"
            ></Box>
            <Box
                height="100%"
                width="50%"
                display="flex"
                flexDirection="column"
                gap={8}
                bg="blue"
            ></Box>


        </Box>
    );
}

export default AnalysedTableComponent;
