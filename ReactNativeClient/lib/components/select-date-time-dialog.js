import React, { Component } from 'react';
import { Platform } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import DatePicker from '@react-native-community/datetimepicker';
import { _ } from '@/lib/locale.js';

const styles = StyleSheet.create({
    dialog: {
        flex: 1,
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    titleText: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', marginTop: 15 },
    button: {
        flex: 1,
        padding: 10,
        margin: 5,
        backgroundColor: 'gray',
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: { color: 'white', fontSize: 16 }
});

class SelectDateTimeDialog extends Component {
    constructor() {
        super();
        this.dialog_ = null;
        this.shown_ = false;
        this.state = { date: null, isVisible: false };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.date != this.state.date) {
            this.setState({ date: newProps.date });
        }
        if ('shown' in newProps) {
            this.show(newProps.shown);
        }
    }

    show(doShow = true) {
        this.setState({ isVisible: doShow });
        this.shown_ = doShow;
    }

    dismiss() {
        this.show(false);
    }

    dateTimeFormat() {
        return 'MM/DD/YYYY HH:mm';
    }

    stringToDate(s) {
        return moment(s, this.dateTimeFormat()).toDate();
    }

    onAccept() {
        if (this.props.onAccept) this.props.onAccept(this.state.date);
    }

    onReject() {
        if (this.props.onReject) this.props.onReject();
    }

    onClear() {
        if (this.props.onAccept) this.props.onAccept(null);
    }

    render() {
        const popupActions = [
            {
                text: _('Confirm'),
                onPress: () => this.onAccept()
            },
            { text: 'Clear', onPress: () => this.onClear() },
            {
                text: _('Cancel'),
                onPress: () => this.onReject()
            }
        ];
        const dtObj = this.state.date || new Date();
        const dt = dtObj.toISOString();

        return (
            <Modal
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.onReject()}
            >
                <View style={styles.dialog}>
                    <Text style={styles.titleText}>{_('Select date')}</Text>
                    {Platform.OS === 'android' ? (
                        // Critical DatePicker not work well on android devices yet
                        // So created this button for test with current time + 10 secs
                        <>
                            <TouchableOpacity
                                key="android_btn"
                                style={styles.button}
                                onPress={() => {
                                    this.setState({
                                        date: new Date(Date.now() + 10000)
                                    });
                                }}
                            >
                                <Text>Click to change date</Text>
                            </TouchableOpacity>
                            <Text>{dt}</Text>
                        </>
                    ) : (
                        <DatePicker
                            value={dtObj}
                            mode="datetime"
                            display="default"
                            onChange={(event, date) => {
                                if (date) {
                                    this.setState({
                                        date: date
                                    });
                                }
                            }}
                            style={{ width: 300 }}
                        />
                    )}
                    <View style={styles.buttonContainer}>
                        {popupActions.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.button}
                                onPress={button.onPress}
                            >
                                <Text style={styles.buttonText}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        );
    }
}

export { SelectDateTimeDialog };
