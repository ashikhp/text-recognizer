import React, { useState, useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { Appbar } from 'react-native-paper';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import uuid from 'uuid';
import Lightbox from "react-native-lightbox";
import Environment from './config/environment.js'


const config = {
    apiKey: Environment['FIREBASE_API_KEY'],
    authDomain: Environment['FIREBASE_AUTH_DOMAIN'],
    databaseURL: Environment['FIREBASE_DATABASE_URL'],
    projectId: Environment['FIREBASE_PROJECT_ID'],
    storageBucket: Environment['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: Environment['FIREBASE_MESSAGING_SENDER_ID']
};

!firebase.apps.length
    ? firebase.initializeApp(config).firestore()
    : firebase.app();

const CardScan = (props) => {

    const { route } = props;
    const [image, SetImage] = useState(null)
    const [uploading, SetUploading] = useState(false)
    const [googleResponse, SetGoogleResponse] = useState(null)
    const [responce, SetResponce] = useState(null)
    const [imagebase, setImageSource] = useState("");
    const [forceRender, setForceRender] = useState(false)
    const [editOption, setEditOption] = useState(false)
    const pickerAction = useRef('');

    useEffect(() => {
        if (image) {
            submitToGoogle();
        }
    }, [image])

    useEffect(() => {
        setTimeout(() => {
            if (route.params.fromGallery) {
                pickImage()

            } else {
                takePhoto()
            }
        }, 200);

    }, [])


    const maybeRenderUploadingOverlay = () => {
        if (uploading) {
            return (
                <View
                    style={[
                        {
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    ]}
                >
                    <ActivityIndicator style={{ marginTop: 60 }} color="#4a8eed" animating size="large" />
                    <Text>Processing...</Text>
                </View>
            );
        }
    };

    const maybeRenderImage = () => {
        if (!image) {
            return;
        } else {

            return (

                <>
                    <Lightbox underlayColor="white"
                        renderContent={() => {
                            return (
                                <Image
                                    style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                                    resizeMode="contain"
                                    source={{
                                        uri: image
                                    }}
                                />
                            )
                        }}
                    >
                        <View style={{ alignSelf: "center", marginTop: 10, marginBottom: 10 }}>
                            <Image
                                style={{ height: 80, width: 100, borderRadius: 10 }}
                                resizeMode={"cover"}
                                source={{
                                    uri: image
                                }}
                            />
                        </View>
                    </Lightbox>
                    {googleResponse && (
                        <>

                            <FlatList
                                data={responce}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item, index }) => (
                                    <>
                                        {item === "" ? null :

                                            <View style={{ backgroundColor: "#e1eef5", padding: 5 }} >

                                                <TextInput
                                                    style={{ padding: 2, fontSize: 16 }}
                                                    value={item}
                                                    returnKeyType='next'
                                                    // autoFocus={index === 0}
                                                    onChangeText={(text) => {
                                                        responce[index] = text
                                                        setForceRender(!forceRender)
                                                    }}></TextInput>

                                            </View>
                                        }
                                    </>
                                )}
                            />

                        </>



                    )

                    }

                </>
            );
        }
    };
    const takePhoto = async () => {
        if (Constants.platform.ios) {
            const { status: cameraStatus } = await Permissions.askAsync(
                Permissions.CAMERA,
            );
            if (cameraStatus !== 'granted') {
                alert('Sorry, Camera permissions not granted');
            }
        }
        let pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,

        });
        compressImage(pickerResult)
        handleImagePicked(pickerResult);
    };

    const pickImage = async () => {
        const { status: cameraRollStatus } = await Permissions.askAsync(
            Permissions.CAMERA_ROLL,
        );
        if (cameraRollStatus !== 'granted') {
            alert('Sorry, Camera roll permissions not granted');
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
        });

        compressImage(pickerResult)
        handleImagePicked(pickerResult);

    };


    const compressImage = async (image) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            image.localUri || image.uri,
            [{ resize: { width: 300, height: 300 } }],
            { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
        );

        const imageUri = manipResult
            ? `data:image/png;base64,${manipResult.base64}`
            : '';
        setImageSource(imageUri);

    };

    const handleImagePicked = async pickerResult => {
        try {
            SetUploading(true)
            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                SetImage(uploadUrl)
            } else {
                props.navigation.goBack();
            }
        }
        catch (e) {
            SetUploading(false)
            alert('Upload failed, sorry, Try again');
        }
        finally {
            SetUploading(false)
        }
    };




    const submitToGoogle = async () => {

        try {
            SetUploading(true)

            const body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: 'TEXT_DETECTION', maxResults: 5 },
                            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                        ],
                        image: {
                            source: {
                                imageUri: image
                            }
                        }
                    }
                ]
            });
            const response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=' +
                Environment['GOOGLE_CLOUD_VISION_API_KEY'],
                {
                    headers: {
                        Accept: 'application',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body
                }
            );
            const responseJson = await response.json();
            const newJsonResponce = responseJson && responseJson.responses[0] && responseJson.responses[0].textAnnotations[0] && responseJson.responses[0].textAnnotations[0].description.split("\n");
            SetResponce(newJsonResponce)
            SetGoogleResponse(responseJson)
            SetUploading(false)
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#4a8eed', height: 50, marginTop: 0 }}>

                <Appbar.Content
                    title={'Image to text'}
                    color='#fff'
                    titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                />


            </Appbar.Header>

            <View style={styles.helpContainer}>
                {maybeRenderImage()}
                {maybeRenderUploadingOverlay()}
            </View>


        </View>
    );
}



async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 10
    },
    contentContainer: {
        paddingTop: 30
    },

    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50
    },
    EyeOff: {
        marginTop: -10,
        textAlign: 'right',
        marginRight: 10,
    },

    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center'
    },

    helpContainer: {
        marginTop: 15,
        padding: 20,
        height: "80%"
    },
    helpContainer1: {
        marginTop: 15,
        alignItems: 'center'
    },
});
export default CardScan;
