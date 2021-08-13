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
                backgroundColor="#226e36"
            />
            <Appbar.Header style={{ backgroundColor: '#226e36', height: 50, marginTop: 0 }}>
                <Appbar.Content
                    title={'Image to Text - Text Recognizer'}
                    color='#fff'
                    titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                />

            </Appbar.Header>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                onPress={() => { setmodal(true) }}
            >
                <MaterialCommunityIcons name="plus"
                    size={60}
                    color="#226e36" />
                <Text>
                    Click here to take image
                </Text>
            </TouchableOpacity>
            <Modal isVisible={modal}
                animationIn='zoomIn'
                animationOut='zoomOut'
            >
                <View style={{ backgroundColor: "#fff", height: 200, borderRadius: 10 }}>

                    <View style={{ backgroundColor: "#226e36", marginTop: -10, height: 30, width: "100%", flexDirection: "row", borderTopEndRadius: 10, borderTopLeftRadius: 10 }}>
                        <Text style={{ fontSize: 14, color: "#fff", padding: 3 }}>Choose Image via</Text>
                        <MaterialCommunityIcons name="close"
                            style={{ marginLeft: "60%" }}
                            onPress={() => { setmodal(false) }}
                            size={30}
                            color="#fff" />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ marginTop: 40, marginLeft: "25%" }}>
                            <Image
                                style={{ height: 65, width: 65 }}
                                resizeMode={'contain'}
                                source={require('./assets/camera.png')}
                            />
                            <Text style={{ marginLeft: 5, marginTop: 5, color: "#226e36" }}>Camera</Text>
                        </View>
                        <View style={{ marginTop: 43, marginLeft: 45 }}>
                            <Image
                                style={{ height: 63, width: 63 }}
                                resizeMode={'contain'}
                                source={require('./assets/image-gallery.png')}
                            />
                            <Text style={{ marginLeft: 5, marginTop: 5, color: "#226e36" }}>Gallery</Text>
                        </View>
                    </View>


                </View>
            </Modal>
        </>
    );
}

export default home;