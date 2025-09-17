"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Stack, Table } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { Trash2 } from 'lucide-react';

function ViewDatabaseComponent({ pageSet, currentPage }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load saved connections from localStorage on component mount
    useEffect(() => {
        try {
            const savedConnections = JSON.parse(localStorage.getItem('savedConnections') || '[]');
            setItems(savedConnections);
        } catch (error) {
            console.error('Error loading saved connections:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to handle permanent deletion
    const handleDelete = (id) => {
        try {
            // Remove item from state
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            
            // Update localStorage
            localStorage.setItem('savedConnections', JSON.stringify(updatedItems));
            
            // Show success message
            toast.success('Connection deleted successfully');
        } catch (error) {
            console.error('Error deleting connection:', error);
            toast.error('Failed to delete connection');
        }
    };

    // Function to refresh data (useful if called from other components)
    const refreshData = () => {
        try {
            const savedConnections = JSON.parse(localStorage.getItem('savedConnections') || '[]');
            setItems(savedConnections);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

    // Listen for storage changes (in case data is updated from other tabs/components)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'savedConnections') {
                refreshData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom events within the same tab
        const handleCustomRefresh = () => {
            refreshData();
        };
        
        window.addEventListener('refreshSavedConnections', handleCustomRefresh);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('refreshSavedConnections', handleCustomRefresh);
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
            >Find your saved connections</Text>

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
                        No saved connections yet.<br />
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
                                <Table.ColumnHeader fontSize="12px">Title</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Company</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Website</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Social Media</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Email</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Location</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px">Saved Date</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="12px" textAlign="center">Action</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {items.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell fontSize="12px">{item.name}</Table.Cell>
                                    <Table.Cell fontSize="12px">{item.title || 'N/A'}</Table.Cell>
                                    <Table.Cell fontSize="12px">{item.company}</Table.Cell>
                                    <Table.Cell fontSize="12px">
                                        {item.website ? (
                                            <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                                Website
                                            </a>
                                        ) : (
                                            <Text color="gray.400">N/A</Text>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell fontSize="12px">
                                        {item.linkedin ? (
                                            <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                                LinkedIn
                                            </a>
                                        ) : (
                                            <Text color="gray.400">N/A</Text>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell fontSize="12px">{item.email}</Table.Cell>
                                    <Table.Cell fontSize="12px">{item.location}</Table.Cell>
                                    <Table.Cell fontSize="12px">
                                        {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'N/A'}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Button
                                            size="xs"
                                            color="red"
                                            onClick={() => handleDelete(item.id)}
                                            _hover={{
                                                bg: "red.500",
                                                color: "white"

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
    )
}

export default ViewDatabaseComponent