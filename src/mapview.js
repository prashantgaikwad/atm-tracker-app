import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Switch } from 'react-native';
import MapView from 'react-native-maps';
import Actions from './actions'
import AtmDetails from './atm-details';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 18.520510;
const LONGITUDE = 73.856733;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function getColor(status) {
  let color;
    switch (status) {
    case 'CASH_AVAILABLE_SHORT_QUEUE':
      color = '#00FF00';
      break;
    case 'NO_CASH' :
      color = '#FFFFFF';
      break;
    case 'CASH_AVAILABLE_LONG_QUEUE':
      color = '#0000FF';
      break;
    case 'SELECTED':
      color = '#FFFF00';
      break;
    default:
      color = '#FFFFFF';
      break;
  }
  return color;
}

const initialRegion = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: initialRegion,
      markers: [],
      selectedAtm: {},
      withCash: false
    };
    this.searchAtms = this.searchAtms.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  searchAtms() {
    const { region, withCash } = this.state;
    Actions.getAtms(region, withCash, (markers = []) => {
      this.setState({ markers, selectedAtm: {} });
    });
  }

  onMarkerClick(marker) {
    this.setState({ selectedAtm: marker, status: marker.status });
  }

  onUpdate(id, status) {
    const { region } = this.state;
    Actions.updateAtm(id, status, this.searchAtms);
  }

  render() {
    const { selectedAtm = {}, withCash } = this.state;
    const withCashSwitch = (
      <View style={styles.switchStyle}>
        <Text style={{ padding: 1 }}>With Cash</Text>
        <Switch
          onValueChange={(value) => this.setState({ withCash: value})}
          value={withCash} />
        </View>
    );
    const form = selectedAtm._id ?
      (<AtmDetails onUpdate={this.onUpdate} atm={selectedAtm} /> ) : <View />;
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={initialRegion}
          onRegionChangeComplete={(region) => {
            this.setState({ region });
          }}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker._id}
              coordinate={{ latitude: marker.position.lat, longitude: marker.position.lng }}
              pinColor={getColor(marker._id === selectedAtm._id ? 'SELECTED': marker.status )}
              onPress={() => {
                this.onMarkerClick(marker);
              }}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          {withCashSwitch}
          <TouchableOpacity
            onPress={this.searchAtms}
            style={styles.bubble}
          >
            <Text>Search this area</Text>
          </TouchableOpacity>
        </View>
        {form}
      </View>
    );
  }
}

Map.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  switchStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5
  },
});

module.exports = Map;