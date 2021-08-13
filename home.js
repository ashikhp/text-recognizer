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
        </>
    );
}

export default home;