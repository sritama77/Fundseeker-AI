"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { Search, BarChart3, Puzzle, MessageSquare, Check } from 'lucide-react';
import Navbar from '../components/ui/navbar'; 

// Animated Chart Component
const AnimatedGrowthChart = () => {
    const [animationProgress, setAnimationProgress] = useState(0);
    const [showIcons, setShowIcons] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (animationProgress < 100) {
                setAnimationProgress(prev => Math.min(prev + 2, 100));
            } else {
                // Hold for 5 seconds then restart
                setTimeout(() => {
                    setAnimationProgress(0);
                    setShowIcons([]);
                }, 5000);
            }
        }, 20);
        return () => clearTimeout(timer);
    }, [animationProgress]);

    // Add icons as animation progresses
    useEffect(() => {
        if (animationProgress > 15 && !showIcons.includes(0)) {
            setShowIcons(prev => [...prev, 0]);
        }
        if (animationProgress > 25 && !showIcons.includes(1)) {
            setShowIcons(prev => [...prev, 1]);
        }
        if (animationProgress > 35 && !showIcons.includes(2)) {
            setShowIcons(prev => [...prev, 2]);
        }
        if (animationProgress > 45 && !showIcons.includes(3)) {
            setShowIcons(prev => [...prev, 3]);
        }
        if (animationProgress > 55 && !showIcons.includes(4)) {
            setShowIcons(prev => [...prev, 4]);
        }
        if (animationProgress > 65 && !showIcons.includes(5)) {
            setShowIcons(prev => [...prev, 5]);
        }
        if (animationProgress > 75 && !showIcons.includes(6)) {
            setShowIcons(prev => [...prev, 6]);
        }
        if (animationProgress > 85 && !showIcons.includes(7)) {
            setShowIcons(prev => [...prev, 7]);
        }
    }, [animationProgress, showIcons]);

    const points = [
        { x: 10, y: 80 },
        { x: 27, y: 70 },
        { x: 38, y: 45 },
        { x: 55, y: 45 },
        { x: 65, y: 25 },
        { x: 85, y: 10 }
    ];

    const getAnimatedPoints = () => {
        const progress = animationProgress / 100;
        const numPoints = Math.floor(progress * points.length);
        return points.slice(0, Math.max(1, numPoints + 1));
    };

    const animatedPoints = getAnimatedPoints();
    const pathData = animatedPoints.map((point, i) => 
        `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    const areaData = `${pathData} L ${animatedPoints[animatedPoints.length - 1].x} 100 L ${animatedPoints[0].x} 100 Z`;

    // Icon positions scattered around the chart (avoiding the line path)
    const iconPositions = [
        { x: 3 , y: 90, type: 'user', delay: 0 },
        { x: 8, y: 15, type: 'world', delay: 0.2 },
        { x: 35, y: 88, type: 'world', delay: 0.4 },
        { x: 50, y: 12, type: 'search', delay: 0.6 },
        { x: 70, y: 85, type: 'chat', delay: 0.8 },
        { x: 95, y: 15, type: 'user', delay: 1.0 },
        { x: 92, y: 65, type: 'search', delay: 1.2 },
        { x: 25, y: 35, type: 'chat', delay: 1.4 }
    ];

    return (
        <Box position="relative" width="100%" height="100%">
            {/* Floating Icons */}
            {iconPositions.map((pos, i) => (
                showIcons.includes(i) && (
                    <Box
                        key={i}
                        position="absolute"
                        left={`${pos.x}%`}
                        top={`${pos.y}%`}
                        transform="translate(-50%, -50%)"
                        animation="popIn 0.5s ease-out, float 3s ease-in-out infinite"
                        style={{
                            animationDelay: `${pos.delay}s, ${pos.delay}s`
                        }}
                    >
                        {pos.type === 'user' && (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" fill="white" opacity="0.85"/>
                                <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" fill="none" opacity="0.85"/>
                            </svg>
                        )}
                        {pos.type === 'world' && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" opacity="0.85"/>
                                <path d="M3 12h18M12 3c2.5 3 2.5 6 2.5 9s0 6-2.5 9M12 3c-2.5 3-2.5 6-2.5 9s0 6 2.5 9" stroke="white" strokeWidth="1.5" opacity="0.85"/>
                                <ellipse cx="12" cy="12" rx="4" ry="9" stroke="white" strokeWidth="1.5" opacity="0.85"/>
                            </svg>
                        )}
                        {pos.type === 'search' && (
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                <circle cx="10" cy="10" r="6" stroke="white" strokeWidth="2" opacity="0.85"/>
                                <path d="M14.5 14.5L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
                            </svg>
                        )}
                        {pos.type === 'chat' && (
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V14C21 15.6569 19.6569 17 18 17H11L6 21V17H6C4.34315 17 3 15.6569 3 14V6Z" fill="white" opacity="0.85"/>
                                <circle cx="8" cy="10" r="1" fill="#1062F2"/>
                                <circle cx="12" cy="10" r="1" fill="#1062F2"/>
                                <circle cx="16" cy="10" r="1" fill="#1062F2"/>
                            </svg>
                        )}
                    </Box>
                )
            ))}

            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 215, 100, 0.5)" />
                    <stop offset="100%" stopColor="rgba(255, 193, 7, 0.1)" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Grid lines */}
            {[20, 40, 60, 80].map(y => (
                <line 
                    key={y}
                    x1="0" 
                    y1={y} 
                    x2="100" 
                    y2={y} 
                    stroke="rgba(255, 255, 255, 0.1)" 
                    strokeWidth="0.2"
                />
            ))}
            
            {/* Area fill */}
            <path
                d={areaData}
                fill="url(#chartGradient)"
                opacity="0.6"
            />
            
            {/* Line */}
            <path
                d={pathData}
                fill="none"
                stroke="#E5C48A"
                strokeWidth="1"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            
            {/* Animated dots */}
            {animatedPoints.map((point, i) => (
                <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="1.5"
                    fill="#FFD166"
                    filter="url(#glow)"
                    opacity={i === animatedPoints.length - 1 ? 1 : 0.7}
                >
                    {i === animatedPoints.length - 1 && (
                        <animate
                            attributeName="r"
                            values="1.5;2.5;1.5"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    )}
                </circle>
            ))}
        </svg>

        {/* Add CSS animations */}
        <style>{`
            @keyframes popIn {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            @keyframes float {
                0%, 100% {
                    transform: translate(-50%, -50%) translateY(0px);
                }
                50% {
                    transform: translate(-50%, -50%) translateY(-10px);
                }
            }
        `}</style>
    </Box>
    );
};

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

function HomePage({ pageSet, currentPage }) {
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
            pt="80px"
        >
            
            {/* Use the Navbar component */}
            <Navbar currentPage={currentPage} pageSet={pageSet} />

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
                        Automated Investor Discovery & Outreach for Startup Founders
                    </Text>

                    <Text
                        fontFamily={"Poppins"}
                        color="white"
                        fontSize="15px"
                        fontWeight={400}
                        textAlign="left"
                    >
                        Discover the right opportunities, build meaningful connections and accelerate growth - all with the power of AI.
                    </Text>
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
                        width="70%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        //bgColor="#1062F2"
                        borderRadius="15px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        position="relative"
                        overflow="hidden"
                        padding="20px"
                    >
                        <AnimatedGrowthChart />
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
                            strokeWidth={2}
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
                            strokeWidth={2}
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
                            strokeWidth={2}
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
                            strokeWidth={2}
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
                            strokeWidth={2}
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
                            strokeWidth={2}
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

export default HomePage;