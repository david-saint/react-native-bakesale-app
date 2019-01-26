import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import DealItem from './DealItem';

const pt = Platform.select({
  ios: 35,
  android: 0,
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
    backgroundColor: '#eee',
  },
});

class DealList extends Component {
  static propTypes = {
    deals: PropTypes.arrayOf(PropTypes.object).isRequired,
    onItemPress: PropTypes.func.isRequired,
  }

  render() {
    const { deals, onItemPress } = this.props;

    return (
      <View style={styles.list}>
        <FlatList
          data={deals}
          renderItem={({ item }) => <DealItem deal={item} onPress={onItemPress} />}
        />
      </View>
    );
  }
}

export default DealList;
