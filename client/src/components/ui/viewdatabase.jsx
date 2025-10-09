"use client";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Input,
  InputGroup,
  Field,
  FieldLabel,
  FieldRoot,
  FieldErrorText,
  Stack,
  Table,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import UserDetails from "../../store/userform";
import axios from "axios";

function ViewDatabaseComponent({ pageSet, currentPage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = UserDetails();

  //Fetch Saved Items
  const GetAllProfiles = async () => {
    try {
      if (!user?._id) {
        toast.error("No userid found");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/getprofiles`,
        {
          params: {
            userid: user?._id,
          },
        }
      );

      if (res?.data?.Profiles) {
        setItems(res?.data?.Profiles);
        setLoading(false);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Load saved connections from localStorage on component mount
  useEffect(() => {
    GetAllProfiles();
  }, []);

    useEffect(() => {
        if(loading){
        GetAllProfiles();
        }
  }, [loading]);
  // Function to handle permanent deletion
  const handleDelete = async(id) => {
    try {
      // Remove item from state
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/deleteprofile`,{
       "userid":user?._id,
       "deleteid":id 
      })

      if(res?.data?.updated){
        setLoading(true)
        toast.success("deleted succesfully")
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
      toast.error("Failed to delete connection");
    }
  };

  // Function to refresh data (useful if called from other components)
  const refreshData = () => {
    try {
      const savedConnections = JSON.parse(
        localStorage.getItem("savedConnections") || "[]"
      );
      setItems(savedConnections);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Listen for storage changes (in case data is updated from other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "savedConnections") {
        refreshData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events within the same tab
    const handleCustomRefresh = () => {
      refreshData();
    };

    window.addEventListener("refreshSavedConnections", handleCustomRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "refreshSavedConnections",
        handleCustomRefresh
      );
    };
  }, []);

  if (loading) {
    return (
      <Box
        height={"90%"}
        width={"95%"}
        display={"flex"}
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading saved connections...</Text>
      </Box>
    );
  }

  return (
    <Box
      height={"90%"}
      width={"95%"}
      display={"flex"}
      flexDirection={"column"}
      gap={8}
    >
      <Toaster position="top-right" />
      <Text
        fontFamily={"Poppins"}
        color="#001B60"
        fontSize="25px"
        fontWeight={600}
        textAlign={"left"}
      >
        Find your saved connections
      </Text>

      {items.length === 0 ? (
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          minHeight="400px"
        >
          <Text color="gray.500" fontSize="18px" textAlign="center">
            No saved connections yet.
            <br />
            Start by saving connections from your suitable matches!
          </Text>
        </Box>
      ) : (
        /* Table container with both horizontal and vertical scroll */
        <Box
          flex="1"
          overflowY="auto"
          overflowX="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader fontSize="12px">Name</Table.ColumnHeader>
                {/* <Table.ColumnHeader fontSize="12px">Title</Table.ColumnHeader> */}
                <Table.ColumnHeader fontSize="12px">Company</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="12px">Website</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="12px">
                  Social Media
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="12px">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="12px">
                  Location
                </Table.ColumnHeader>
                {/* <Table.ColumnHeader fontSize="12px">
                  Saved Date
                </Table.ColumnHeader> */}
                <Table.ColumnHeader fontSize="12px" textAlign="center">
                  Action
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item._id}>
                  <Table.Cell fontSize="12px">
                    {item?.FounderName ? item?.FounderName : item?.Username}
                  </Table.Cell>
                  {/* <Table.Cell fontSize="12px">{item.title || 'N/A'}</Table.Cell> */}
                  <Table.Cell fontSize="12px">
                    {item?.StartupName ? item?.StartupName : item?.FirmName}
                  </Table.Cell>
                  <Table.Cell fontSize="12px">
                    {item.StartupWebsiteUrl ? (
                      <a
                        href={item?.StartupWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0066cc",
                          textDecoration: "underline",
                        }}
                      >
                        Website
                      </a>
                    ) : (
                         <a
                        href={item?.InvestorWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0066cc",
                          textDecoration: "underline",
                        }}
                      >
                        Website
                      </a>
                    )}
                  </Table.Cell>
                  <Table.Cell fontSize="12px">
                    {item?.SocialMediaLink ? (
                      <a
                        href={item?.SocialMediaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0066cc",
                          textDecoration: "underline",
                        }}
                      >
                        LinkedIn
                      </a>
                    ) : (
                       <a
                        href={item?.InvestorSocialMedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0066cc",
                          textDecoration: "underline",
                        }}
                      >
                        LinkedIn
                      </a>
                    )}
                  </Table.Cell>
                  <Table.Cell fontSize="12px">{item?.CompanyEmail}</Table.Cell>
                  <Table.Cell fontSize="12px">{item?.Location ? item?.Location : item?.InvestorLocation }</Table.Cell>
                  {/* <Table.Cell fontSize="12px">
                    {item.savedAt
                      ? new Date(item.savedAt).toLocaleDateString()
                      : "N/A"}
                  </Table.Cell> */}
                  <Table.Cell textAlign="center">
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDelete(item?._id)}
                      _hover={{
                        bg: "red.500",
                        color: "white",
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}

export default ViewDatabaseComponent;
