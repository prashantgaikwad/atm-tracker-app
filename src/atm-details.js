import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Picker, Button } from 'react-native';


export default class AtmDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = { status: props.atm.status };
    this.onUpdate = this.onUpdate.bind(this);
  }

  getUpdatedAtString(updatedAtString= '') {
    let elapsedTime = '';
    const updatedAt = Date.parse(updatedAtString) || 0;
    const now = (new Date()).getTime();
    const mins = (now - updatedAt)/(1000*60);
    elapsedTime = 'Updated ' +  Math.round(mins)+' mins ago';
    if (mins >= 60) {
      const hrs = mins/60;
      elapsedTime = 'Updated ' + (hrs === 1 ? 'an hour ago' : Math.round(hrs) + ' hours ago');
      if(hrs > 24) {
        const days = Math.floor(hrs/24);
        const hrsAndDay = Math.floor(hrs%24);;
        elapsedTime = 'Updated ' + (days === 1 ? '1 day ' : days + ' days ') + hrsAndDay + ' hrs ago';
      }
    }
    return elapsedTime;
  }

  onUpdate() {
    const { atm, onUpdate } = this.props;  
    const { status } = this.state;  
    onUpdate(atm._id, status)
  }

  render(){
    const { atm } = this.props;
    const updatedAtString = atm._id ? this.getUpdatedAtString(atm.updatedAt) : '';

    return (
      <View style={styles.formStyle}>
        <Text>{atm.name}</Text>
        <Text>{updatedAtString}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Picker style={{ flex: 3 }}
            selectedValue={this.state.status}
            onValueChange={(status) => this.setState({status: status})}>
            <Picker.Item label="No cash" value="NO_CASH" />
            <Picker.Item label="Cash available short Q" value="CASH_AVAILABLE_SHORT_QUEUE" />
            <Picker.Item label="Cash available long Q" value="CASH_AVAILABLE_LONG_QUEUE" />
          </Picker>
          <Button style={{ flex: 1 }}
            onPress={this.onUpdate}
            title="Update"
          />
        </View>
      </View>
    );
  }
}

AtmDetails.propTypes = {
  onUpdate: React.PropTypes.func,
  atm: React.PropTypes.object,
};

const styles = StyleSheet.create({
  formStyle: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
});