import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

const styles = StyleSheet.create({
  input: {
    height: 50,
    marginHorizontal: 12,
  },
});

class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
  };

  state = {
    searchTerm: '',
  };

  debouncedSearchDeals = debounce(this.props.searchDeals, 300);

  handleChange = (searchTerm) => {
    this.setState({ searchTerm }, () => {
      // debounce this shit
      this.debouncedSearchDeals(this.state.searchTerm);
    });
  }

  render() {
    return (
      <TextInput
        placeholder="Search All Deals."
        style={styles.input}
        onChangeText={this.handleChange}
      />
    );
  }
}

export default SearchBar;
