import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';

import DealList from './components/DealList';
import SearchBar from './components/SearchBar';
import DealDetail from './screens/DealDetail';

import Ajax from './lib/ajax';

const pt = Platform.select({
  ios: 35,
  android: 0,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  target: {
    fontSize: 50,
    marginHorizontal: 50,
    marginVertical: 20,
    textAlign: 'center',
  },
  main: {
    flex: 1,
    marginTop: pt,
  },
});

class App extends Component {
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
  }

  async componentDidMount() {
    const deals = await Ajax.fetchInitialDeals();
    this.setState({ deals });
  }

  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await Ajax.fetchDealsSearchResult(searchTerm);
    }
    this.setState({ dealsFromSearch });
  }

  setCurrentDeal = (dealId) => {
    this.setState({ currentDealId: dealId });
  }

  unsetCurrentDeal = () => {
    this.setState({ currentDealId: null });
  }

  currentDeal = () => {
    const { deals, currentDealId } = this.state;
    return deals.find(deal => deal.key === currentDealId);
  }

  render() {
    const { deals, dealsFromSearch, currentDealId } = this.state;

    if (currentDealId) {
      return (
        <DealDetail
          initialDealData={this.currentDeal()}
          onBack={this.unsetCurrentDeal}
        />
      );
    }

    const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeals={this.searchDeals} />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.target}>BakeSale!</Text>
      </View>
    );
  }
}

export default App;
