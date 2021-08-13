import React from 'react';
import { Text, View, Platform, StatusBar } from 'react-native';
import { Divider, Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const home = (props) => {
    return (
        <>
            <StatusBar
                backgroundColor="#226e36"
            />
            <Appbar.Header style={{ backgroundColor: '#226e36', height: 50, marginTop: 0 }}>
                <Appbar.Content
                    title={'Image to Text'}
                    color='#fff'
                    titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                />

            </Appbar.Header>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons name="plus"
                    size={60}
                    color="#226e36" />
                <Text>
                    Click here to take image
                </Text>
            </View>
        </>
    );
}

export default home;