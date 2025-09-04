"use client"
import toast, { Toaster } from 'react-hot-toast';
import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  Stack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SignupStartupStore from "../../store/startupform";
import UserDetails from '../../store/userform';

function ViewProfileComponent({ pageSet, currentPage }) {
  const { user, setUser } = UserDetails();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Box
      height={"90%"}
      width={"95%"}
      display={"flex"}
      flexDirection={"column"}
      gap={6}
    >
      <Toaster position="top-right" />

      <Text
        fontFamily={"Poppins"}
        color="#001B60"
        fontSize="25px"
        fontWeight={600}
        textAlign={"left"}
      >
        Your profile
      </Text>

      {/* WHITE CARD (scrollable) */}
      <Box
        flex="1"
        overflowY="auto"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
        p={6}
      >
        {/* Header with company name and edit button */}
        <Flex align="center" justify="space-between" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight={700} color="#011F3C">
              {user?.StartupName || user?.Username || user?.FirmName || "— Company name not provided —"}
            </Text>
            {(user?.BriefPitch || user?.BioThesis) && (
              <Text fontSize="sm" color="gray.600" fontStyle="italic" mt={1}>
                {user?.BriefPitch || user?.BioThesis}
              </Text>
            )}
          </Box>

          <Button
            size="md"
            bg="white"
            border="2px solid"
            borderColor="black"
            color="black"
            _hover={{
              bg: "#001B60",
              color: "white",
              borderColor: "#001B60"
            }}
            onClick={() => {
              if (typeof pageSet === "function") pageSet(6);
              else toast('Edit action not wired');
            }}
            px={6}
            py={2}
            borderRadius="md"
            fontWeight={500}
          >
            Edit Profile
          </Button>
        </Flex>

        {/* Two-column layout */}
        <Flex direction={["column", "row"]} gap={8} align="start">
          {/* Left Section */}
          <Box flex="1" minW={["100%", "50%"]}>
            {/* General Info */}
            <Box mb={6}>
              <Text fontSize="lg" fontWeight={600} color="black" mb={3}>
                General Info
              </Text>
              <Stack spacing={3}>
                <Box>
                  <Text color="black" fontWeight={600} as="span">
                    {user?.FounderName ? "Founder:" : "Firm Name:"}
                  </Text>
                  <Text as="span" ml={2}>
                    {user?.FounderName || user?.FirmName || "-"}
                  </Text>
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} as="span">Location:</Text>
                  <Text as="span" ml={2}>
                    {user?.Location || user?.InvestorLocation || "-"}
                  </Text>
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} as="span">Stage:</Text>
                  <Text as="span" ml={2}>
                    {user?.CurrentStage || 
                     (user?.SelectedStages?.length > 0 ? user?.SelectedStages.join(", ") : "-")}
                  </Text>
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} mb={1}>Industry:</Text>
                  <Box>
                    {Array.isArray(user?.StartupIndustryCategories) && user?.StartupIndustryCategories.length > 0 ? (
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {user?.StartupIndustryCategories.map((cat, i) => (
                          <Box 
                            key={i}
                            px={3}
                            py={1}
                            bg="#F3F6FF" 
                            color="#011F3C" 
                            borderRadius="md"
                            fontSize="sm"
                          >
                            {cat}
                          </Box>
                        ))}
                      </Box>
                    ) : Array.isArray(user?.SelectedIndustries) && user?.SelectedIndustries.length > 0 ? (
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {user?.SelectedIndustries.map((cat, i) => (
                          <Box 
                            key={i}
                            px={3}
                            py={1}
                            bg="#F3F6FF" 
                            color="#011F3C" 
                            borderRadius="md"
                            fontSize="sm"
                          >
                            {cat}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Text>-</Text>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* About Section */}
            <Box mb={6}>
              <Text fontSize="lg" fontWeight={600} color="black" mb={3}>
                About
              </Text>
              <Stack spacing={4}>
                {user?.BriefPitch && (
                  <Box>
                    <Text color="black" fontWeight={600} mb={1}>Brief Pitch:</Text>
                    <Text color="gray.700">{user?.BriefPitch}</Text>
                  </Box>
                )}

                {user?.ProblemStatement && (
                  <Box>
                    <Text color="black" fontWeight={600} mb={1}>Problem Statement:</Text>
                    <Text color="gray.700">{user?.ProblemStatement}</Text>
                  </Box>
                )}

                {user?.Solution && (
                  <Box>
                    <Text color="black" fontWeight={600} mb={1}>Solution:</Text>
                    <Text color="gray.700">{user?.Solution}</Text>
                  </Box>
                )}

                {user?.SyndicationPreference && (
                  <Box>
                    <Text color="black" fontWeight={600} mb={1}>Syndication Preference:</Text>
                    <Text color="gray.700">{user?.SyndicationPreference}</Text>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Business Details */}
            <Box>
              <Text fontSize="lg" fontWeight={600} color="black" mb={3}>
                Business Details
              </Text>
              <Stack spacing={4}>
                <Box>
                  <Text color="black" fontWeight={600} mb={1}>
                    {user?.BusinessModel ? "Business Model:" : "Investment Ranges:"}
                  </Text>
                  {user?.BusinessModel ? (
                    <Text color="gray.700">{user?.BusinessModel}</Text>
                  ) : user?.CheckSizeRange?.length > 0 ? (
                    <Box display="flex" flexWrap="wrap" gap={2}>
                      {user?.CheckSizeRange.map((range, index) => (
                        <Box 
                          key={index}
                          px={3}
                          py={1}
                          bg="#F3F6FF" 
                          color="#011F3C"
                          borderRadius="md"
                          fontSize="sm"
                        >
                          {range}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Text color="gray.700">-</Text>
                  )}
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} mb={1}>
                    {user?.Competitors ? "Competitors & Differentiation:" : "Ticket Types:"}
                  </Text>
                  {user?.Competitors ? (
                    <Text color="gray.700">{user?.Competitors}</Text>
                  ) : user?.TicketType?.length > 0 ? (
                    <Box display="flex" flexWrap="wrap" gap={2}>
                      {user?.TicketType.map((type, index) => (
                        <Box 
                          key={index}
                          px={3}
                          py={1}
                          bg="#F3F6FF" 
                          color="#011F3C"
                          borderRadius="md"
                          fontSize="sm"
                        >
                          {type}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Text color="gray.700">-</Text>
                  )}
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Right Section */}
          <Box flex="1" minW={["100%", "40%"]} minH="400px">
            {/* Contact Section */}
            <Box mb={6}>
              <Text fontSize="lg" fontWeight={600} color="black" mb={3}>
                Contact
              </Text>
              <Stack spacing={3}>
                <Box>
                  <Text color="black" fontWeight={600} as="span">Email:</Text>
                  <Text as="span" ml={2} color="gray.700">
                    {user?.CompanyEmail || "-"}
                  </Text>
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} as="span">Website:</Text>
                  <Text as="span" ml={2}>
                    {user?.StartupWebsiteUrl || user?.InvestorWebsite ? (
                      <Link 
                        href={user?.StartupWebsiteUrl || user?.InvestorWebsite} 
                        isExternal 
                        color="blue.600"
                        textDecoration="underline"
                      >
                        Visit Website
                      </Link>
                    ) : (
                      <Text as="span" color="gray.700">-</Text>
                    )}
                  </Text>
                </Box>

                <Box>
                  <Text color="black" fontWeight={600} as="span">Social Media:</Text>
                  <Text as="span" ml={2}>
                    {user?.SocialMediaLink || user?.InvestorSocialMedia ? (
                      <Link 
                        href={user?.SocialMediaLink || user?.InvestorSocialMedia} 
                        isExternal 
                        color="blue.600"
                        textDecoration="underline"
                      >
                        View Profile
                      </Link>
                    ) : (
                      <Text as="span" color="gray.700">-</Text>
                    )}
                  </Text>
                </Box>
              </Stack>
            </Box>

            {/* Elevator Pitch / Bio-Thesis Section */}
            <Box mb={6}>
              <Text fontSize="lg" fontWeight={600} color="black" mb={3}>
                {user?.ElevatorPitch ? "Elevator Pitch" : "Bio-Thesis"}
              </Text>
              <Box 
                p={4} 
                border="1px solid" 
                borderColor="gray.200" 
                borderRadius="md"
                bg="gray.50"
              >
                {user?.ElevatorPitch || user?.BioThesis ? (
                  <Text color="gray.700" lineHeight="1.6">
                    {user?.ElevatorPitch || user?.BioThesis}
                  </Text>
                ) : (
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {user?.StartupName || user?.FounderName ? "No elevator pitch added yet" : "No bio-thesis added yet"}
                  </Text>
                )}
              </Box>
            </Box>

            {/* Additional Info Box */}
            <Box 
              p={4} 
              bg="#F8F9FF" 
              borderRadius="md" 
              border="1px solid" 
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                <Text as="span" fontWeight={600} color="#001B60">Tip:</Text> Keep your profile updated to improve visibility and matching with potential {user?.StartupName || user?.FounderName ? "investors" : "startups"}. A clear, concise tagline helps create better connections.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default ViewProfileComponent;