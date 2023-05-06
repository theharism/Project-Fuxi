import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import GenreToggleButton from "../components/GenreToggleButton";
import BackButton from "../components/BackButton";
import LoadingContext from "../store/LoadingContext";

import colours from "../config/colours.js";

import { getInstitute } from "../api/institutes";

function PatientMusicForm({ route, navigation }) 
{
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const { name, age, ethnicity, birthdate, birthplace, language } = route.params;

    const genres = [
        "Cantonese",
        "Chinese",
        "Christian",
        "English",
        "Hainanese",
        "Hindi",
        "Hokkien",
        "Malay",
        "Mandarin",
        "TV",
        "Tamil",
    ]; // TODO: force to pick at least 3
    const [preferredGenres, setPreferredGenres] = useState(
        Array(11).fill(false)
    );

    const updatePreferences = (genreIndex) => {
        let newPreferredGenres = [...preferredGenres];
        newPreferredGenres[genreIndex] = !newPreferredGenres[genreIndex];
        setPreferredGenres(newPreferredGenres);
    };

    const submitHandler = async (evt) => {
        evt.preventDefault();

        // check if there are at least 3 genres selected
        const selectedGenreCount = preferredGenres.filter(
            (genre) => genre
        ).length;
        if (selectedGenreCount < 3) {
            alert("Please select at least 3 genres.");
            return;
        }

        const genreData = Object.assign(
            ...genres.map((k, i) => ({ [k]: preferredGenres[i] }))
        ); // construct object

        // Get list of genres by filtering out the false values
        const selectedGenres = Object.keys(genreData).filter(
            (key) => genreData[key]
        );

        setIsLoading (true);

        const institute = await getInstitute();

        const newPatientData = {
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres: selectedGenres,
            instituteId: institute._id,
        };

        console.log(newPatientData);

        const response = await fetch("http://localhost:8080/patient/new", {
            body: JSON.stringify(newPatientData),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        const data = await response.json();

        if (data.status === "ERROR") 
        {
            setIsLoading(false);
            console.log(data.message);
        }
        else 
        {
            console.log("Patient created");
            console.log(">>>>>>>>>>>>>");
            console.log(data.patient);
            console.log(data.patient._id);

            setIsLoading(false);
            navigation.navigate("Dashboard");
        }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Genres</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.info}>
                    Please select the genre(s) for your patient
                </Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.rightContainer}>
                    {genres.map((genre, index) => (
                        <GenreToggleButton
                            genre={genre}
                            key={index}
                            updatePreferences={() => updatePreferences(index)}
                        />
                    ))}

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={submitHandler}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.bg,
    },
    titleContainer: {
        marginTop: 100,
        alignItems: "center",
        marginBottom: 20,
    },
    bodyContainer: {
        flex: 0.9,
        flexDirection: "column",
        width: "100%",
        paddingHorizontal: "10%",
    },
    info: {
        fontSize: 18,
        color: colours.primaryText,
        textAlign: "center",
        marginBottom: 20,
    },
    rightContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: colours.primaryText,
        fontSize: 32,
        fontWeight: "500",
        marginBottom: 10,
    },
    inputContainer: {
        backgroundColor: colours.secondary,
        borderRadius: 30,
        width: 200,
        height: 50,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        color: colours.primaryText,
    },
    clickableText: {
        height: 30,
        color: colours.primary,
    },
    submitButton: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 100,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
});

export default PatientMusicForm;
