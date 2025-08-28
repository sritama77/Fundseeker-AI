"use client"
import toast, { Toaster } from 'react-hot-toast';
import { Box, Flex, Image, Text, Button, Input, InputGroup, Field, FieldLabel, FieldRoot, FieldErrorText, Stack, Table } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { Trash2 } from 'lucide-react';

const initialItems = [
    {
        id: 1,
        name: "Maarten Goossens",
        title: "Founder & Partner",
        company: "Anterro Capital",
        website: "https://www.anterracapital.com/",
        linkedin: "https://www.linkedin.com/in/maarten-goossens-407962a",
        email: "mtrgoossens@gmail.com",
        facebook: "http://www.facebook.com/maarten.goossens.56",
        twitter: "http://twitter.com/mtrgoossens",
        location: "Amsterdam"
    },
    {
        id: 2,
        name: "Adam Draper",
        title: "Founder and Managing Director",
        company: "Boost VC",
        website: "https://boost.vc/",
        linkedin: "https://www.linkedin.com/in/adraper",
        email: "adam@boost.vc",
        facebook: "https://facebook.com/adam172draper",
        twitter: "https://twitter.com/adamdraper",
        location: "Atherton"
    },
    // ... (rest of the data remains the same)
];

function ViewDatabaseComponent({ pageSet, currentPage }) {
    const [items, setItems] = useState(initialItems);

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
        toast.success('Connection deleted successfully');
    };

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

            {/* Table container with both horizontal and vertical scroll */}
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
                            <Table.ColumnHeader fontSize="12px">LinkedIn</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="12px">Email</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="12px">Facebook</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="12px">Twitter</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="12px">Location</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="12px" textAlign="center">Action</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {items.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell fontSize="12px">{item.name}</Table.Cell>
                                <Table.Cell fontSize="12px">{item.title}</Table.Cell>
                                <Table.Cell fontSize="12px">{item.company}</Table.Cell>
                                <Table.Cell fontSize="12px">
                                    <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                        Website
                                    </a>
                                </Table.Cell>
                                <Table.Cell fontSize="12px">
                                    <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                        LinkedIn
                                    </a>
                                </Table.Cell>
                                <Table.Cell fontSize="12px">{item.email}</Table.Cell>
                                <Table.Cell fontSize="12px">
                                    <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                        Facebook
                                    </a>
                                </Table.Cell>
                                <Table.Cell fontSize="12px">
                                    <a href={item.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                        Twitter
                                    </a>
                                </Table.Cell>
                                <Table.Cell fontSize="12px">{item.location}</Table.Cell>
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
        </Box>
    )
}

export default ViewDatabaseComponent