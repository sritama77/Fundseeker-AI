"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { CircleUserRound, Search, BarChart3, Puzzle, MessageSquare, Check, CircleSmall, Settings, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';

// Tilting Tile Component (for Core Features and FAQ)
const TiltingTile = ({ icon: IconComponent, title, description, height = "auto", width = "95%" }) => {
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
                        fontSize="15px"
                        fontWeight={600}
                        textAlign="left"
                    >
                        {title}
                    </Text>
                    <Text
                        fontFamily="Poppins"
                        color="black"
                        fontSize="12px"
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

// FAQ Tile Component (no icon, tilting effect)
const FAQTile = ({ title, description, height = "auto", width = "95%" }) => {
    return (
        <Box
            height={height}
            width={width}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor="white"
            flexDirection="column"
            gap={4}
            borderRadius="15px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"
            cursor="pointer"
            transition="all 0.3s ease"
            _hover={{
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-4px) scale(1.02)",
            }}
        >
            <Box
                height="88%"
                width="90%"
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                flexDirection="column"
            >
                <Text
                    fontFamily="Poppins"
                    color="black"
                    fontSize="15px"
                    fontWeight={600}
                    textAlign="left"
                    mb={2}
                >
                    {title}
                </Text>
                <Text
                    fontFamily="Poppins"
                    color="black"
                    fontSize="12px"
                    fontWeight={400}
                    textAlign="left"
                    lineHeight="1.4"
                >
                    {description}
                </Text>
            </Box>
        </Box>
    );
};

// Team Member Tile Component (simple hover effect)
const TeamTile = ({ name, role, height = "auto", width = "300px" }) => {
    return (
        <Box
            height={height}
            width={width}
            minWidth={width} // Ensures tiles maintain size during scroll
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor="white"
            flexDirection="column"
            gap={3}
            borderRadius="15px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"
            cursor="pointer"
            transition="all 0.3s ease"
            _hover={{
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-4px)",
            }}
        >
            <Box
                height="80%"
                width="85%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap={2}
            >
                <Text
                    fontFamily="Poppins"
                    color="black"
                    fontSize="16px"
                    fontWeight={600}
                    textAlign="center"
                >
                    {name}
                </Text>
                <Text
                    fontFamily="Poppins"
                    color="#666"
                    fontSize="13px"
                    fontWeight={400}
                    textAlign="center"
                    lineHeight="1.4"
                >
                    {role}
                </Text>
            </Box>
        </Box>
    );
};

function AboutPage({ pageSet, currentPage }) {
    // State for team carousel
    const [teamScrollPosition, setTeamScrollPosition] = useState(0);

    // Team members data
    const teamMembers = [
        { name: "Sritama Basu", role: "UI/UX designer, Frontend Developer, Git Coordinator" },
        { name: "Soumyajit Manna", role: "AI/ML developer" },
        { name: "Ramit Bid", role: "Data Analyst" },
        { name: "Saikat Das", role: "Cloud Engineer" },
        { name: "Udayan Majumder", role: "Full-Stack Developer" },
        { name: "Udayangshu Mandal", role: "Backend Developer" }
    ];

    // FAQ data
    const faqData = [
        {
            title: "How do you source investor data?",
            description: "We aggregate public, permitted sources (VC blogs, Twitter via API, public firm pages) and partner databases: we prioritize API access over scraping."
        },
        {
            title: "Can I control outreach drafts?",
            description: "Yes — every outreach message is editable before sending and tracked in the dashboard."
        },
        {
            title: "How is my data used?",
            description: "We use submitted data to compute matches and craft outreach; we never sell raw individual data. See Privacy Policy for details."
        },
        {
            title: "What models do you use?",
            description: "We use sentence-transformers for embeddings and GPT-class models for summarization & outreach (configurable)."
        }
    ];

    const handlePageSelect = (pageNumber) => {
        if (pageSet) {
            pageSet(pageNumber);
        }
    };

    // Team carousel scroll functions
    const scrollTeamLeft = () => {
        setTeamScrollPosition(prev => Math.max(prev - 320, 0));
    };

    const scrollTeamRight = () => {
        const maxScroll = (teamMembers.length - 3) * 320;
        setTeamScrollPosition(prev => Math.min(prev + 320, maxScroll));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box
            minHeight={"100vh"}
            width={"100%"}
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            flexDirection={"column"}
            bg="linear-gradient(to top, #0054D8 30%, #001B60 100%)"
            gap={12}
            pt="100px"
            overflowX="hidden" // Prevents horizontal scroll on main container
        >

            {/* Use the Navbar component */}
            <Navbar currentPage={currentPage} pageSet={pageSet} />

            {/* Hero Section */}
            <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={32}
            >
                {/* Main Text Section */}
                <Box
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
                        We turn multi-source investor signals into clean insights, rank relevance with hybrid AI logic, and enable high-quality, personalized outreach — all with privacy-first practices.
                    </Text>
                </Box>

                {/* What We Prioritize Box */}
                <Box
                    width={"40%"}
                    display={"flex"}
                    justifyContent={"right"}
                    alignItems={"center"}
                >
                    <Box
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
                            width={"90%"}
                            display={"flex"}
                            justifyContent={"left"}
                            alignItems={"left"}
                            flexDirection={"column"}
                            gap={4}
                            px={6}
                            py={4}
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

            {/* Main Content Section - Core Features and How it Works */}
            <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"flex-start"}
                flexDirection={"row"}
                gap={20}
            >
                {/* Core Features Section (Left Side - 6 tiles in 3x2 grid) */}
                <Box
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
                        Core features
                    </Text>

                    {/* Subheading */}
                    <Text
                        fontFamily={"Poppins"}
                        color={"#B8BCC8"}
                        fontSize={"15px"}
                        fontWeight={400}
                        textAlign={"left"}
                        mb={2}
                    >
                        Concise, explainable components that power matches and outreach.
                    </Text>

                    {/* First Row of Tiles */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Search}
                                title="Multi‑Agent Pipeline"
                                description="Collector → Reducer → Summarizer → Embedder → Matcher"
                                height="110px"
                            />
                        </Box>

                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={BarChart3}
                                title="Hybrid Matching"
                                description="Semantic + rule filters (stage, sector, geography, check size)"
                                height="110px"
                            />
                        </Box>

                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Puzzle}
                                title="Ethical Data"
                                description="Public sources & API-first approach; no restricted scraping"
                                height="110px"
                            />
                        </Box>
                    </Box>

                    {/* Second Row of Tiles */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={MessageSquare}
                                title="Personalized Outreach"
                                description="Editable GPT-powered templates for every match"
                                height="110px"
                            />
                        </Box>

                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Settings}
                                title="Learning Loop"
                                description="Response signals continuously improve relevance"
                                height="110px"
                            />
                        </Box>

                        <Box
                            width={"33%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <TiltingTile
                                icon={Database}
                                title="Cloud-ready"
                                description="Qdrant-backed semantic search with metadata filters"
                                height="110px"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* How it Works Section (Right Side) */}
                <Box
                    width={"35%"}
                    display={"flex"}
                    justifyContent={"right"}
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
                        How it works — the multi-agent flow
                    </Text>

                    {/* Multi-agent Flow Steps */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                            minWidth="20px"
                        >
                            1.
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            <Text as="span" fontWeight={600}>Collector:</Text> Aggregates public signals and partner data.
                        </Text>
                    </Box>

                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                            minWidth="20px"
                        >
                            2.
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            <Text as="span" fontWeight={600}>Reducer:</Text> Structures and dedupes noisy records.
                        </Text>
                    </Box>

                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                            minWidth="20px"
                        >
                            3.
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                        >
                            Summarizer:</Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            LLM compresses signals into clean bios.
                        </Text>
                    </Box>

                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                            minWidth="20px"
                        >
                            4.
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                        >
                            Embedder:</Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Converts bios into vectors for search.
                        </Text>
                    </Box>

                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"left"}
                        flexDirection={"row"}
                        gap={2}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                            minWidth="20px"
                        >
                            5.
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                        >
                            Matcher:</Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Hybrid scoring returns prioritized investor lists.
                        </Text>
                    </Box>

                    {/* Q&A Section */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"left"}
                        alignItems={"flex-start"}
                        flexDirection={"column"}
                        gap={2}
                        mt={4}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"15px"}
                            fontWeight={600}
                            textAlign={"left"}
                        >
                            Why multi-layer agents?
                        </Text>
                        <Text
                            fontFamily={"Poppins"}
                            color={"white"}
                            fontSize={"14px"}
                            fontWeight={400}
                            textAlign={"left"}
                        >
                            Layered agents allow independent scaling and targeted improvements — summarizers can be upgraded without touching the collector or vector store.
                        </Text>
                    </Box>
                </Box>
            </Box>

            {/* Team Section */}
            <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                gap={6}
            >
                {/* Team Header */}
                <Box
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"flex-start"}
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
                        Team
                    </Text>
                    <Text
                        fontFamily={"Poppins"}
                        color={"#B8BCC8"}
                        fontSize={"15px"}
                        fontWeight={400}
                        textAlign={"left"}
                    >
                        A compact team focused on product, ML, and growth.
                    </Text>
                </Box>

                {/* Team Carousel Container */}
                <Box
                    width={"90%"}
                    position="relative"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {/* Left Arrow */}
                    <Button
                        position="absolute"
                        left="-20px"
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={10}
                        backgroundColor="rgba(255, 255, 255, 0.9)"
                        borderRadius="50%"
                        width="40px"
                        height="40px"
                        minWidth="40px"
                        padding={0}
                        onClick={scrollTeamLeft}
                        disabled={teamScrollPosition <= 0}
                        opacity={teamScrollPosition <= 0 ? 0.5 : 1}
                        _hover={{
                            backgroundColor: "white",
                            transform: "translateY(-50%) scale(1.1)"
                        }}
                        transition="all 0.2s ease"
                    >
                        <ChevronLeft size={20} color="#0056E6" />
                    </Button>

                    {/* Team Tiles Container */}
                    <Box
                        width="100%"
                        overflow="hidden"
                        borderRadius="10px"
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            gap={4}
                            transition="transform 0.3s ease"
                            style={{
                                transform: `translateX(-${teamScrollPosition}px)`
                            }}
                        >
                            {teamMembers.map((member, index) => (
                                <TeamTile
                                    key={index}
                                    name={member.name}
                                    role={member.role}
                                    height="200px"
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Right Arrow */}
                    <Button
                        position="absolute"
                        right="-20px"
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={10}
                        backgroundColor="rgba(255, 255, 255, 0.9)"
                        borderRadius="50%"
                        width="40px"
                        height="40px"
                        minWidth="40px"
                        padding={0}
                        onClick={scrollTeamRight}
                        disabled={teamScrollPosition >= (teamMembers.length - 3) * 320}
                        opacity={teamScrollPosition >= (teamMembers.length - 3) * 320 ? 0.5 : 1}
                        _hover={{
                            backgroundColor: "white",
                            transform: "translateY(-50%) scale(1.1)"
                        }}
                        transition="all 0.2s ease"
                    >
                        <ChevronRight size={20} color="#0056E6" />
                    </Button>
                </Box>
            </Box>

            {/* FAQ Section */}
            <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                gap={6}
            >
                {/* FAQ Header */}
                <Box
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"flex-start"}
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
                        FAQ
                    </Text>
                </Box>

                {/* FAQ Tiles Grid - 2x2 Layout */}
                <Box
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    gap={4}
                >
                    {/* First Row of FAQ Tiles */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                        gap={4}
                    >
                        <Box
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <FAQTile
                                title={faqData[0].title}
                                description={faqData[0].description}
                                height="150px"
                            />
                        </Box>

                        <Box
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <FAQTile
                                title={faqData[1].title}
                                description={faqData[1].description}
                                height="150px"
                            />
                        </Box>
                    </Box>

                    {/* Second Row of FAQ Tiles */}
                    <Box
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        flexDirection={"row"}
                        gap={4}
                    >
                        <Box
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <FAQTile
                                title={faqData[2].title}
                                description={faqData[2].description}
                                height="150px"
                            />
                        </Box>

                        <Box
                            width={"50%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            <FAQTile
                                title={faqData[3].title}
                                description={faqData[3].description}
                                height="150px"
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Call to Action Section */}
            <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"flex-start"}
                mb={8} // Added margin bottom for better spacing at page end
            >
                <Box
                    width={"90%"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bgColor={"white"}
                    borderRadius={"10px"}
                    boxShadow={"0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"}
                    gap={10}
                    py={6}
                >
                    <Box
                        width={"50%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Text
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
                        width={"50%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                        gap={1}
                    >
                        <Text
                            fontFamily={"Poppins"}
                            color={"black"}
                            fontSize={"16px"}
                            fontWeight={600}
                            textAlign={"center"}
                        >
                            Let us help you!
                        </Text>
                        <Button
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
                            transition="all 0.5s ease"
                        >
                            Get Started
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AboutPage;