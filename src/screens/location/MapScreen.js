/* eslint-disable react/react-in-jsx-scope */
import {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import CustomMarker from './components/marker';
import FlatlistItem from './components/FlatlistItem';
import Icons from '../../assets/constants/Icons';
import DummyLocaleData from './DummyLocaleData';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const MapScreen = () => {
  const places = DummyLocaleData.chargers;
  const flatlist = useRef();
  const map = useRef();
  const onViewChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const selectedPlace = viewableItems[0].item;
      setSelectedPlaceId(selectedPlace.id);
    }
  });
  const width = useWindowDimensions().width;
  const viewConfig = useRef({itemVisiblePercentThreshold: 70});
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    if (!selectedPlaceId || !flatlist) {
      return;
    }
    const index = DummyLocaleData?.chargers?.findIndex(
      place => place.id === selectedPlaceId,
    );
    flatlist.current.scrollToIndex({index});

    const selectedPlace = DummyLocaleData.chargers[index];
    const region = {
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      latitudeDelta: 0.8,
      longitudeDelta: 0.8,
    };
    map?.current?.animateToRegion(region);
  }, [selectedPlaceId]);

  const initialRegion = {
    latitude: 28.476335498070025,
    longitude: 77.0179819682911,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  const myLocation = {
    latitude: 28.476335498070025,
    longitude: 77.0179819682911,
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={map}
          initialRegion={initialRegion}
          style={styles.map}
          showsUserLocation={true}
          minZoomLevel={14}>
          <Marker coordinate={myLocation}>
            <View style={styles.myLocationIconContainer}>
              <Image
                source={Icons.myLocationIcon}
                style={styles.myLocationIcon}
              />
            </View>
          </Marker>
          {places.map(place => (
            <CustomMarker
              coordinate={{
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
              }}
              isSelected={place.id === selectedPlaceId}
              // onPress={() => {
              //   console.log('AY');
              //   setSelectedPlaceId(place.id);
              // }}
              id={place.id}
              setSelectedPlaceId={setSelectedPlaceId}
            />
          ))}
        </MapView>

        {/* <View style={styles.topContainer}>
        <TouchableOpacity>
          <Image source={Icons.cartIcon} style={styles.menuIcon} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <View style={styles.searchContainerLeft}>
            <Image source={Icons.cartIcon} style={styles.dot} />
            <TextInput
              placeholder="Search for the compatible chargers"
              placeholderTextColor={'#ffffff'}
              style={styles.textInput}
            />
          </View>
          <Image source={Icons.cartIcon} style={styles.filterIcon} />
        </View>
      </View> */}

        <View style={styles.flatlistContainer}>
          <FlatList
            ref={flatlist}
            data={DummyLocaleData.chargers}
            renderItem={({item}) => (
              <FlatlistItem
                post={item}
                setSelectedPlaceId={setSelectedPlaceId}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 120}
            snapToAlignment={'center'}
            decelerationRate={'fast'}
            viewabilityConfig={viewConfig.current}
            onViewableItemsChanged={onViewChanged.current}
          />
        </View>
      </View>
    </>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  myLocationIconContainer: {
    width: 40,
    height: 40,
  },
  myLocationIcon: {
    width: 25,
    height: 25,
    tintColor: '#df3168',
    resizeMode: 'contain',
  },
  button: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
  topContainer: {
    position: 'absolute',
    top: 60,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B',
    resizeMode: 'contain',
  },
  searchContainer: {
    width: '85%',
    backgroundColor: '#1D1E27',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  searchContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    tintColor: '#44D7B6',
    resizeMode: 'contain',
  },
  textInput: {
    paddingLeft: 10,
    fontSize: 12,
    color: '#ffffff',
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#44D7B6',
    resizeMode: 'contain',
  },
  flatlistContainer: {
    position: 'absolute',
    bottom: 10,
  },
});
