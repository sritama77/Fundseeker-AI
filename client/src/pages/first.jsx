
import { Box, Flex, Image, Text, Button, Menu, Portal } from "@chakra-ui/react";
import { useEffect } from "react";


function FirstPage({ pageSet }) {
 

  useEffect(() => {
    const temp = localStorage.getItem("token")
    console.log(temp)
    temp !== null ? pageSet(11) : null
    
  }, [])


  return (
    <Box position={"relative"}
      height="100%"
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image position={"absolute"}  //bg image
        top={0} left={0}
        zIndex={1}
        height="100%"
        width={"100%"}
        src="/Intersect.png" />

      <Box height="60%"
        width={"50%"}
        position={"relative"}
        zIndex={2}
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}>
        <Box                                                //fundseeker logo
          height={"20%"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}>
          <Image height={"120%"}
            width={"auto"}
            display={"flex"}
            src="/fundseeker_logo.png" />
        </Box>
        <Box
          height={"20%"}
          width={"100%"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text                                             //fundseeker ai text
            className="useNunito"
            color="#D2B47D"
            fontSize="25px"
            letterSpacing={1}
            fontWeight={600}
            paddingBottom="4px"
            textAlign="center"
          >
            FundSeeker AI
          </Text>

          <Box                                              //golden line
            height="2px"
            width={"80%"}
            borderRadius="full"
            backgroundColor={"#E5C48A"}
            mt="4px" />
        </Box>
        <Text className="usePoppins"                            //motto text
          color="white"
          textAlign={"center"}
          fontSize={"20px"}
          letterSpacing={2}
          fontWeight={400}
        >Dream. Pitch. Succeed.</Text>
        <Text className="usePoppins"
          color="white"
          textAlign={"center"}
          fontSize={"20px"}
          fontWeight={400}
        >Helping startups find investors who believe in their vision.</Text>

        <Box display={"flex"}                                 //login button
          justifyContent={"center"}
          alignItems={"center"}
          gap={8}
          mt={6}>
          <Button
            onClick={() => { pageSet(3) }}
            width="130px"
            variant="outline"
            borderColor="white"
            color="white"
            _hover={{
              backgroundColor: "#E5C48A",
              color: "#011F3C",
              borderColor: "#E5C48A"
            }}
            transition="all 0.5s ease">
            LOG IN            </Button>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button                                             //signup button
                width="130px"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{
                  backgroundColor: "#E5C48A",
                  color: "#011F3C",
                  borderColor: "#E5C48A"
                }}
                _expanded={{
                  backgroundColor: "#E5C48A",   // when dropdown is open
                  color: "#011F3C",
                  borderColor: "#E5C48A"
                }}
                transition="all 0.5s ease"
              >
                SIGN UP
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item>
                    <Button
                      onClick={() => { pageSet(1) }}
                      width="100%"
                      justifyContent="flex-start"          // aligns text to the left
                      variant="ghost"                       // removes border & bg
                      _hover={{ bg: "rgba(255,255,255,0.1)" }}  // optional hover
                      _focus={{ boxShadow: "none" }}        // removes focus ring
                      _active={{ bg: "transparent" }}       // no active highlight
                      fontFamily="Poppins"
                      color="white"
                      fontWeight="normal"
                      border={"none"}
                      borderRadius="0"
                      px={4}                                // horizontal padding
                      py={2}                                // vertical padding
                    >
                      Sign Up as a Startup
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      onClick={() => { pageSet(2) }}
                      width="100%"
                      justifyContent="flex-start"          // aligns text to the left
                      variant="ghost"                       // removes border & bg
                      _hover={{ bg: "rgba(255,255,255,0.1)" }}  // optional hover
                      _focus={{ boxShadow: "none" }}        // removes focus ring
                      _active={{ bg: "transparent" }}       // no active highlight
                      fontFamily="Poppins"
                      color="white"
                      fontWeight="normal"
                      border={"none"}
                      borderRadius="0"
                      px={4}                                // horizontal padding
                      py={2}                                // vertical padding
                    >
                      Sign Up as an Investor
                    </Button>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>

          </Menu.Root>

        </Box>
      </Box>
    </Box>

  );
}
export default FirstPage;