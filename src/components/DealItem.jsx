import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { priceDisplay } from '../lib/util';

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: 'rgba(50,50,50, 0.2)',
    shadowOffset: { width: 3, height: 4 },
    margin: 10,
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  name: {
    fontSize: 22,
    color: '#333',
    fontWeight: '500',
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    marginTop: 10,
    color: '#000',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 150,
  },
});

class DealItem extends Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  handlePress = () => {
    const { deal, onPress } = this.props;
    onPress(deal.key);
  };

  render() {
    const { deal } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={this.handlePress}>
        <Image
          source={{ uri: deal.media[0] }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{deal.cause.name}</Text>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DealItem;
