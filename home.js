import React, { useState } from 'react';
import { Text, View, Platform, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Divider, Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

const home = (props) => {
    const [modal, setmodal] = useState(false)
    return (
        <>
            <StatusBar
                backgroundColor="#4a8eed"
            />
            <Appbar.Header style={{ backgroundColor: '#4a8eed', height: 50, marginTop: 0 }}>
                <Appbar.Content
                    title={'Image to Text - Text Recognizer'}
                    color='#fff'
                    titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                />

            </Appbar.Header>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                onPress={() => { setmodal(true) }}
            >
                <View style={{ backgroundColor: "#fff", borderRadius: 50, borderWidth: 0.444, padding: 10 }}>
                    <MaterialCommunityIcons name="plus"
                        size={60}
                        color="#4a8eed" />
                </View>
                <Text style={{ marginTop: 5 }}>
                    Tap anywhere to take image
                </Text>
            </TouchableOpacity>
            <Modal isVisible={modal}
                animationIn='zoomIn'
                animationOut='zoomOut'
            >
                <View style={{ backgroundColor: "#fff", height: 200, borderRadius: 10 }}>

                    <View style={{ backgroundColor: "#4a8eed", marginTop: -10, height: 30, width: "100%", borderTopEndRadius: 10, borderTopLeftRadius: 10 }}>
                        <Text style={{ fontSize: 14, color: "#fff", padding: 3, marginLeft: 4 }}>Choose Image via</Text>
                    </View>
                    <MaterialCommunityIcons name="close"
                        style={{ alignSelf: "flex-end", marginTop: -30 }}
                        onPress={() => { setmodal(false) }}
                        size={30}
                        color="#fff" />
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={{ marginTop: 40, marginLeft: "25%" }}>
                            <Image
                                style={{ height: 65, width: 65 }}
                                resizeMode={'contain'}
                                source={require('./assets/photo-camera.png')}
                            />
                            <Text style={{ marginLeft: 5, marginTop: 5, color: "black", fontSize: 16 }}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 40, marginLeft: 45 }}>
                            <Image
                                style={{ height: 63, width: 63 }}
                                resizeMode={'contain'}
                                source={require('./assets/gallery.png')}
                            />
                            <Text style={{ marginLeft: 5, marginTop: 5, color: "black", fontSize: 16 }}>Gallery</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </Modal>
        </>
    );
}

export default home;