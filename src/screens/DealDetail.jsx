import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Linking,
  Platform,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from 'react-native';

import Ajax from '../lib/ajax';
import { priceDisplay } from '../lib/util';

const pt = Platform.select({
  ios: 35,
  android: 0,
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    position: 'relative',
  },
  backContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: pt + 15,
    paddingLeft: 15,
    zIndex: 3,
  },
  backButton: {
    fontSize: 11,
    color: '#fff',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    height: '7%',
    width: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    height: '100%',
    width: '50%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#dddd',
  },
  cause: {
    height: '100%',
    width: '50%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 25,
  },
  userName: {
    fontSize: 10,
  },
  causeName: {
    fontSize: 10,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: '45%',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    height: '48%',
    backgroundColor: '#fff',
  },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginVertical: 5,
    width: '80%',
  },
  contentPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
    marginVertical: 5,
    width: '20%',
    textAlign: 'right',
  },
  contentDescription: {
    paddingVertical: 10,
    color: '#555',
    fontSize: 11,
    lineHeight: 22,
  },
});

class DealItem extends Component {
  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  }

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  imageXPos = new Animated.Value(0);

  width = Dimensions.get('window').width;

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gst) => {
      this.imageXPos.setValue(gst.dx);
    },
    onPanResponderRelease: (evt, gst) => {
      // determine if the swipe has gone for more than 40% of the screen width
      if (Math.abs(gst.dx) > this.width * 0.4) {
        const direction = Math.sign(gst.dx); // -1 for left, and 1 for right
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleSwipe(direction));
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0,
        }).start();
      }
    },
  });

  async componentDidMount() {
    const { deal } = this.state;
    const fullDeal = await Ajax.fetchDealDetail(deal.key);
    this.setState({ deal: fullDeal });
  }

  openDealUrl = () => {
    const { deal } = this.state;
    Linking.openURL(deal.url);
  };

  handleSwipe = (d) => {
    const { imageIndex, deal } = this.state;
    // If there's nothing to swipe to, return.
    if (!deal.media[imageIndex - d]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
      return;
    }
    // swipe to next picture.
    this.setState(prevState => ({
      imageIndex: prevState.imageIndex - d,
    }), () => {
      this.imageXPos.setValue(this.width * d * -1);
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
    });
  };

  render() {
    const { deal, imageIndex } = this.state;
    const { onBack } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={onBack}
          >
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
        <Animated.Image
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[imageIndex] }}
          style={[{ left: this.imageXPos }, styles.image]}
        />
        <View style={styles.info}>
          {deal.user && (
            <View style={styles.userInfo}>
              <Image source={{ uri: deal.user.avatar }} style={styles.userImage} />
              <Text style={styles.userName}>{deal.user.name}</Text>
            </View>
          )}
          {deal.cause && (
            <View style={styles.cause}>
              <Text style={styles.causeName}>{deal.cause.name}</Text>
            </View>
          )}
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.contentHead}>
            <Text style={styles.contentTitle}>{deal.title}</Text>
            <Text style={styles.contentPrice}>{priceDisplay(deal.price)}</Text>
          </View>
          <Text style={styles.contentDescription}>{deal.description}</Text>
          <Button title="Buy this deal!" onPress={this.openDealUrl} />
        </ScrollView>
      </View>
    );
  }
}

export default DealItem;
