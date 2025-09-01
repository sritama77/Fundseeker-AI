"use client"
import toast, { Toaster } from 'react-hot-toast';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Link,
  Stack,
  Tag,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { useEffect } from "react";
import SignupStartupStore from "../../store/startupform";
import UserDetails from '../../store/userform';

function ViewStartupProfileComponent({ pageSet, currentPage }) {
const  {user,setUser} = UserDetails()

  useEffect(() => {
    // optional: give gentle toast if profile is missing
    if (!user) {
      //toast("No profile loaded — complete your profile from Signup flow.");
    }
    console.log(user)
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
        Your startup profile
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
        {/* Header */}
        <Flex align="center" justify="space-between" mb={4} gap={4}>
          <Box>
            <Text fontSize="2xl" fontWeight={700} color="#011F3C">
              {user?.StartupName || user?.Username || "— Startup name not provided —"}
            </Text>
            {user?.BriefPitch && (
              <Text fontSize="sm" color="gray.600" fontStyle="italic" mt={1}>
                {user?.BriefPitch || user?.BioThesis}
              </Text>
            )}
          </Box>

          <Flex gap={3} align="center">
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                // take user to edit flow - change the pageSet index to the edit page id you use
                // if you don't have an edit flow mapped, replace with a modal or custom handler
                if (typeof pageSet === "function") pageSet(6); // adjust index if needed
                else toast('Edit action not wired');
              }}
            >
              Edit Profile
            </Button>

            {/* <Button
              size="sm"
              colorScheme="blue"
              onClick={() => {
                // Example: open pitch deck in new tab if present
                if (user?.pitch_deck_url) window.open(user?.pitch_deck_url, "_blank");
                else toast.error("No pitch deck uploaded");
              }}
            >
              View Pitch Deck
            </Button> */}
          </Flex>
        </Flex>

        <Box mb={4} />

        {/* Grid-like two-column layout using Stack */}
        <Stack direction={["column", "row"]} spacing={6} align="start">
          {/* Left column - General & About */}
          <Box flex="1" minW={["100%", "60%"]}>
            {/* General Info */}
            <Text fontSize="lg" fontWeight={600} color="#033F79" mb={2}>
              General Info
            </Text>
            <Stack spacing={2} mb={4}>
              <Text><b>{user?.FounderName ? "Founder: ": "FirmName: " }</b> {user?.FounderName || user?.FirmName || "-"}</Text>
              <Text><b>Email:</b> {user?.CompanyEmail || "-"}</Text>
              <Text>
                <b>Website:</b>{" "}
                {user?.StartupWebsiteUrl ? (
                  <Link href={user?.StartupWebsiteUrl} isExternal color="blue.600">
                    {user?.StartupWebsiteUrl}
                  </Link>
                ) : (
                    <Link href={user?.InvestorWebsite} isExternal color="blue.600">
                      {user?.InvestorWebsite}
                    </Link>
                )}
              </Text>
              <Text><b>Location:</b> {user?.Location || user?.InvestorLocation || "-"}</Text>
              <Text>
                <b>Social:</b>{" "}
                {user?.SocialMediaLink ? (
                  <Link href={user?.SocialMediaLink} isExternal color="blue.600">
                    {user?.SocialMediaLink}
                  </Link>
                ) : (
                    <Link href={user?.InvestorSocialMedia} isExternal color="blue.600">
                      {user?.InvestorSocialMedia}
                    </Link>
                )}
              </Text>
              <Text><b>Stage:</b> {user?.CurrentStage || user?.SelectedStages?.map((items,index)=>
              <Text key={index}>{items}</Text>
              )}</Text>

              <Box>
                <Text as="span" fontWeight="bold">Industry:</Text>{" "}
                {Array.isArray(user?.StartupIndustryCategories) && user?.StartupIndustryCategories.length > 0 ? (
                  <Wrap mt={2}>
                    {user?.StartupIndustryCategories.map((cat, i) => (
                      <Box key={i}>
                        <Box size="sm" bg="#F3F6FF" color="#011F3C" borderRadius="md">
                          {cat}
                        </Box>  
                      </Box>
                    ))}
                  </Wrap>
                ) : (
                    <Wrap mt={2}>
                      {user?.SelectedIndustries?.map((cat, i) => (
                        <Box key={i}>
                          <Box size="sm" bg="#F3F6FF" color="#011F3C" borderRadius="md">
                            {cat}
                          </Box>
                        </Box>
                      ))}
                    </Wrap>
                )}
              </Box>
            </Stack>

            <Box mb={4} />

            {/* About / Pitch Details */}
            <Text fontSize="lg" fontWeight={600} color="#033F79" mb={2}>
              About
            </Text>
            <Stack spacing={3} mb={4}>
              <Box>
                <Text fontSize="sm" color="gray.600"><b>{user?.ProblemStatement ? "Problem :" : "SyndicationPreference:"}</b></Text>
                <Text mt={1}>{user?.ProblemStatement || user?.SyndicationPreference ||"-"}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600"><b>{user?.Solution ? "Solution:" : ""}</b></Text>
                <Text mt={1}>{user?.Solution || ""}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600"><b>{user?.ElevatorPitch ? "Elevator Pitch: " : "Bio-Thesis: "}</b></Text>
                <Text mt={1}>{user?.ElevatorPitch || user?.BioThesis || "-"}</Text>
              </Box>
            </Stack>

            <Box mb={4} />

            {/* Business Details */}
            <Text fontSize="lg" fontWeight={600} color="#033F79" mb={2}>
              Business Details
            </Text>
            <Stack spacing={3}>
              <Box>
                <Text fontSize="sm" color="gray.600"><b>{ user?.BusinessModel ? "Business Model:" : "Ranges"}</b></Text>
                <Text mt={1}>{user?.BusinessModel || user?.CheckSizeRange?.map((items,index)=>
                <Text key={index}>{items}</Text>)}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600"><b>Competitors & Differentiation:</b></Text>
                <Text mt={1}>{user?.Competitors || user?.TicketType.map((items,index)=><Text key={index}>{items}</Text>)||"-"}</Text>
              </Box>
            </Stack>
          </Box>

          {/* Right column - Quick contact & actions */}
          <Box flex="0 0 320px" minW="260px">
            <Text fontSize="lg" fontWeight={600} color="#033F79" mb={2}>
              Quick Actions
            </Text>
            <Stack spacing={3} mb={6}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  // trigger summary generation in your backend if you have the endpoint
                  // For now show toast
                  toast("Generate summary action (wire this to API)");
                }}
              >
                Generate LLM Summary
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast("Index vector action (wire this to API)");
                }}
              >
                Vectorize & Index
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast("Export profile (wire export / PDF)");
                }}
              >
                Export as PDF
              </Button>
            </Stack>

            <Box mb={4} />

            <Text fontSize="lg" fontWeight={600} color="#033F79" mb={2}>
              Contact
            </Text>
            <Stack spacing={2}>
              <Text><b>Email:</b> {user?.CompanyEmail || "-"}</Text>
              <Text>
                <b>Website:</b>{" "}
                {user?.StartupWebsiteUrl ? (
                  <Link href={user?.StartupWebsiteUrl} isExternal color="blue.600">
                    Visit site
                  </Link>
                ) : (
                    <Link href={user?.InvestorWebsite} isExternal color="blue.600">
                      Visit site
                    </Link>
                )}
              </Text>
            </Stack>

            <Box my={4} />

            <Text fontSize="sm" color="gray.500">
              Tip: Edit profile to update info shown to investors. Make your tagline short and clear for better matches.
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default ViewStartupProfileComponent;
