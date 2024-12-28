import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";

const SearchBar = ({ data, searchKeys, onFilter, currentDashBoard }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (text) => {
    setQuery(text);

    const filteredData = data.filter((item) =>
      searchKeys.some((key) =>
        item[key]?.toLowerCase().includes(text.toLowerCase())
      )
    );

    onFilter(filteredData);
  };

  return (
    <>
      {currentDashBoard === "main" ? (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search blogs..."
            value={query}
            onChangeText={handleSearch}
          />
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search blogs..."
            value={query}
            onChangeText={handleSearch}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  profileContainer: {
    marginBottom: 20,
    width: "90%",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default SearchBar;
