import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import DealList from './components/DealList';
import DealDetail from './screens/DealDetail';

import Ajax from './lib/ajax';

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
});

class App extends Component {
  state = {
    deals: [],
    currentDealId: null,
  }

  async componentDidMount() {
    const deals = await Ajax.fetchInitialDeals();
    this.setState({ deals });
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
    const { deals, currentDealId } = this.state;

    if (currentDealId) {
      return (
        <DealDetail
          initialDealData={this.currentDeal()}
          onBack={this.unsetCurrentDeal}
        />
      );
    }

    if (deals.length > 0) {
      return <DealList deals={deals} onItemPress={this.setCurrentDeal} />;
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.target}>BakeSale!</Text>
      </View>
    );
  }
}

export default App;
