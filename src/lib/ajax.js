const API = 'https://bakesaleforgood.com/api';

export default {
  async fetchInitialDeals() {
    try {
      const response = await fetch(`${API}/deals`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return console.error(error);
    }
  },
  async fetchDealDetail(dealId) {
    try {
      const response = await fetch(`${API}/deals/${dealId}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return console.error(error);
    }
  },
};
