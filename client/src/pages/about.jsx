"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState } from "react"
import { CircleUserRound, Search, BarChart3, Puzzle, MessageSquare, Check, CircleSmall } from 'lucide-react';
import Navbar from '../components/ui/navbar';

// Tilting Tile Component
const TiltingTile = ({ icon: IconComponent, title, description, height = "100%", width = "95%" }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (y - centerY) / centerY * 10; // Max 10 degrees
        const tiltY = (centerX - x) / centerX * 10; // Max 10 degrees

        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <Box
            height={height}
            width={width}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Box
                height="100%"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor="white"
                flexDirection="row"
                gap={4}
                borderRadius="15px"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"
                cursor="pointer"
                transition="box-shadow 0.3s ease"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                    overflow: 'visible'
                }}
                _hover={{
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)"
                }}
            >
                <Box
                    height="70%"
                    width="10%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                    style={{ transform: 'translateZ(20px)' }}
                >
                    <IconComponent
                        size={40}
                        color="#0056E6"
                        strokeWidth={1.5}
                    />
                </Box>
                <Box
                    height="88%"
                    width="70%"
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    flexDirection="column"
                    style={{ transform: 'translateZ(10px)' }}
                >
                    <Text
                        fontFamily="Poppins"
                        color="black"
                        fontSize="20px"
                        fontWeight={600}
                        textAlign="left"
                    >
                        {title}
                    </Text>
                    <Text
                        fontFamily="Poppins"
                        color="black"
                        fontSize="15px"
                        fontWeight={400}
                        textAlign="left"
                    >
                        {description}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

function AboutPage({ pageSet, currentPage }) {
    const handlePageSelect = (pageNumber) => {
        if (pageSet) {
            pageSet(pageNumber);
        }
    };

    return (
        <Box
            height="100%"
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            bg="linear-gradient(to top, #0054D8 30%, #001B60 100%)"
            gap={8}
        >

            {/* Use the Navbar component */}
            <Navbar currentPage={currentPage} pageSet={pageSet} />


            {/* <Box
                height="10%"
                width={"100%"}
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                <Box                                                //fundseeker logo
                    height={"95%"}
                    width={"10%"}
                    display={"flex"}
                    justifyContent={"center"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    gap={1}
                    paddingTop={2}>
                    <Image height={"80%"}
                        width={"auto"}
                        display={"flex"}
                        src="/fundseeker_logo.png" />
                </Box>





                <Box                                                //navbar
                    height={"100%"}
                    width={"80%"}
                    display={"flex"}
                    justifyContent={"center"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={2}>

                    <Box
                        height="60%"
                        width="60%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgColor="rgba(217, 217, 217, 0.3)"
                        borderRadius="50px"
                        backdropFilter="blur(10px)"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        px={8}
                        gap={36}
                        position="relative"
                        overflow="hidden"
                    >

                        <Text
                            fontFamily="Poppins"
                            fontSize="18px"
                            fontWeight={currentPage === 9 ? 600 : 400}
                            color={currentPage === 9 ? "#E5C48A" : "white"}
                            cursor="pointer"
                            position="relative"
                            transition="all 0.3s ease"
                            px={4}
                            py={2}
                            _hover={currentPage !== 9 ? {
                                color: "#E5C48A",
                                _after: {
                                    width: "100%",
                                    backgroundColor: "#E5C48A"
                                }
                            } : {
                            }}
                            _after={currentPage !== 9 ? {
                                content: '""',
                                position: "absolute",
                                width: "0%",
                                height: "2px",
                                bottom: "0px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "transparent",
                                transition: "all 0.3s ease"
                            } : {}}
                            onClick={() => handlePageSelect(9)}
                        >
                            ABOUT
                        </Text>

                        <Text
                            fontFamily="Poppins"
                            fontSize="18px"
                            fontWeight={currentPage === 8 ? 600 : 400}
                            color={currentPage === 8 ? "#E5C48A" : "white"}
                            cursor="pointer"
                            position="relative"
                            transition="all 0.3s ease"
                            px={4}
                            py={2}
                            _hover={currentPage !== 8 ? {
                                color: "#E5C48A",
                                _after: {
                                    width: "100%",
                                    backgroundColor: "#E5C48A"
                                }
                            } : {}}
                            _after={currentPage !== 8 ? {
                                content: '""',
                                position: "absolute",
                                width: "0%",
                                height: "2px",
                                bottom: "0px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "transparent",
                                transition: "all 0.3s ease"
                            } : {}}
                            onClick={() => handlePageSelect(8)}
                        >
                            HOME
                        </Text>


                        <Text
                            fontFamily="Poppins"
                            fontSize="18px"
                            fontWeight={currentPage === 10 ? 600 : 400}
                            color={currentPage === 10 ? "#E5C48A" : "white"}
                            cursor="pointer"
                            position="relative"
                            transition="all 0.3s ease"
                            px={4}
                            py={2}
                            _hover={currentPage !== 10 ? {
                                color: "#E5C48A",
                                _after: {
                                    width: "100%",
                                    backgroundColor: "#E5C48A"
                                }
                            } : {}}
                            _after={currentPage !== 10 ? {
                                content: '""',
                                position: "absolute",
                                width: "0%",
                                height: "2px",
                                bottom: "0px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "transparent",
                                transition: "all 0.3s ease"
                            } : {}}
                            onClick={() => handlePageSelect(10)}
                        >
                            PRICING
                        </Text>
                    </Box>

                </Box>


                <Box                                                //profile
                    height={"100%"}
                    width={"10%"}
                    display={"flex"}
                    justifyContent={"center"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={2}>
                    <CircleUserRound
                        height={"50%"}
                        width={"auto"}
                        display={"flex"}
                        color={'white'}
                        strokeWidth={1.5}
                    />
                </Box>
            </Box> */}

            <Box
                height="30%"
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={32}
            >

                <Box                                //2nd div first text box
                    height={"100%"}
                    width={"40%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    gap={4}
                >
                    <Text
                        fontFamily={"Poppins"}
                        color="white"
                        fontSize="30px"
                        fontWeight={600}
                        textAlign="left"
                    >
                        Smart Investor Matching for Startups & Investors
                    </Text>

                    <Text
                        fontFamily={"Poppins"}
                        color={"white"}
                        fontSize={"15px"}
                        fontWeight={400}
                        textAlign="left"
                    >
                        We turn multi-source investor signals into clean insights, rank relevance with hybrid AI logic, and enable high-quality, personalized outreach — all with privacy-first practices.                    </Text>
                </Box>

                <Box                                        //chart box
                    height={"100%"}
                    width={"40%"}
                    display={"flex"}
                    justifyContent={"right"}
                    alignItems={"center"}
                >
                    <Box
                        height="100%"
                        width="80%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgColor="white"
                        borderRadius="15px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        position="relative"
                    >
                        <Box
                            height={"80%"}
                            width={"80%"}
                            display={"flex"}
                            justifyContent={"left"}
                            alignItems={"left"}
                            flexDirection={"column"}
                            gap={4}
                        >
                            <Text
                                fontFamily={"Poppins"}
                                color={"black"}
                                fontSize={"22px"}
                                fontWeight={500}
                                textAlign={"left"}
                            >
                                What we prioritize
                            </Text>


                            <Box
                                height={"10%"}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"left"}
                                alignItems={"center"}
                                flexDirection={"row"}
                                gap={2}
                            >
                                <CircleSmall
                                    size={12}
                                    color="black"
                                    strokeWidth={1.5}
                                    fill="black"
                                />

                                <Text
                                    fontFamily={"Poppins"}
                                    color={"black"}
                                    fontSize={"15px"}
                                    fontWeight={400}
                                    textAlign={"left"}
                                >
                                    Accuracy of matches through hybrid scoring
                                </Text>
                            </Box>
                            <Box
                                height={"10%"}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"left"}
                                alignItems={"center"}
                                flexDirection={"row"}
                                gap={2}
                            >
                                <CircleSmall
                                    size={12}
                                    color="black"
                                    strokeWidth={1.5}
                                    fill="black"
                                />

                                <Text
                                    fontFamily={"Poppins"}
                                    color={"black"}
                                    fontSize={"15px"}
                                    fontWeight={400}
                                    textAlign={"left"}
                                >
                                    Data ethics: APIs and public sources first
                                </Text>
                            </Box>
                            <Box
                                height={"10%"}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"left"}
                                alignItems={"center"}
                                flexDirection={"row"}
                                gap={2}
                            >
                                <CircleSmall
                                    size={12}
                                    color="black"
                                    strokeWidth={1.5}
                                    fill="black"
                                />

                                <Text
                                    fontFamily={"Poppins"}
                                    color={"black"}
                                    fontSize={"15px"}
                                    fontWeight={400}
                                    textAlign={"left"}
                                >
                                    Actionability: editable outreach and CRM exports
                                </Text>
                            </Box>

                        </Box>



                    </Box>
                </Box>
            </Box>

            <Box
                height={"40%"}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
                gap={32}
            >
                <Box                                //3rd div how it works er part
                    height={"100%"}
                    width={"50%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                    flexDirection={"column"}
                    gap={2}
                >
                    <Text
                        fontFamily={"Poppins"}
                        color={"white"}
                        fontSize={"22px"}
                        fontWeight={500}
                        textAlign={"left"}
                    >
                        How It Works
                    </Text>
                    <Box                            //first duto rec
                        height={"50%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                    >
                        <Box
                            height={"100%"}
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Search}
                                title="Discover"
                                description="Get investor data from ethical sources for accurate insights."
                            />
                        </Box>

                        <Box
                            height={"100%"}
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={BarChart3}
                                title="Analyze & Rank"
                                description="Summarize investor profiles and rank them with semantic search."
                            />
                        </Box>
                    </Box>

                    <Box                                        //2nd duto box
                        height={"50%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Box
                            height={"100%"}
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Puzzle}
                                title="Match & Score"
                                description="Smart matching based on sector, stage, size, and geography."
                            />
                        </Box>

                        <Box
                            height={"100%"}
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={MessageSquare}
                                title="Outreach"
                                description="Generate investor messages with AI-driven context awareness."
                            />
                        </Box>
                    </Box>
                </Box>

                <Box                                        //key features box
                    height={"100%"}
                    width={"30%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"left"}
                    flexDirection={"column"}
                    gap={2}
                >
                    <Text
                        fontFamily={"Poppins"}
                        color={"white"}
                        fontSize={"22px"}
                        fontWeight={500}
                        textAlign={"left"}
                    >
                        Key Features
                    </Text>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Multi-Agent AI Architecture
                        </Text>

                    </Box>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Hybrid Matching (Semantic + Rule-based)
                        </Text>

                    </Box>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Personalized Outreach Generation
                        </Text>

                    </Box>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            FastAPI + React Powered
                        </Text>

                    </Box>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Ethical Data Handling & Compliance
                        </Text>

                    </Box>
                    <Box
                        height={"10%"}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Check
                            size={25}
                            color="#09B285"
                            strokeWidth={1.5}
                        />

                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Learning Feedback Loop
                        </Text>

                    </Box>


                </Box>
            </Box>

            <Box
                height="20%"
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"flex-start"}
            >
                <Box
                    height={"80%"}
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bgColor={"white"}
                    borderRadius={"10px"}
                    boxShadow={"0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"}
                    gap={10}
                >
                    <Box
                        height={"100%"}
                        width={"50%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Text                                             // text Want to find investors for your Startup?
                            fontFamily="Poppins"
                            color="black"
                            fontSize="20px"
                            fontWeight={600}
                            textAlign="center"
                        >
                            Want to find investors for your Startup or start Funding?
                        </Text>


                    </Box>


                    <Box
                        height={"100%"}
                        width={"50%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                        gap={1}
                    >
                        <Text                                             // text Let us help you!
                            fontFamily={"Poppins"}
                            color={"black"}
                            fontSize={"16px"}
                            fontWeight={600}
                            textAlign={"center"}
                        >
                            Let us help you!
                        </Text>
                        <Button                                               //get started button
                            width={"200px"}
                            backgroundColor={"#004ECA"}
                            color={"white"}
                            borderRadius={"10px"}
                            fontFamily={"Poppins"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignContent={"center"}
                            fontSize={"16px"}
                            onClick={() => { pageSet(0) }}

                            _hover={{
                                backgroundColor: "#E5C48A",
                                color: "#011F3C",
                            }}
                            transition="all 0.5s ease">    Get Started  </Button>


                    </Box>
                </Box>


            </Box>
        </Box>
    );
}

export default AboutPage;