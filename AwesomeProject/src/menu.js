import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

const window = Dimensions.get('window');
const uri = 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png';

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width - 56,
        height: window.height,
        backgroundColor: 'gray',
        padding: 20
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5
    }
});

module.exports = class Menu extends Component {
    static propTypes = {
        onItemSelected: PropTypes.func.isRequired
    };

    render() {
        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={{ uri }} />
                    <Text style={styles.name}>Your name</Text>
                </View>
                <Text
                    onPress={() => this.props.onItemSelected('About')}
                    style={styles.item}
                >
                    About
                </Text>
                <Text
                    onPress={() => this.props.onItemSelected('Contacts')}
                    style={styles.item}
                >
                    Contacts
                </Text>

                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>Contacts</Text>
                <Text style={styles.item}>ContactsLL</Text>
            </ScrollView>
        );
    }
};
