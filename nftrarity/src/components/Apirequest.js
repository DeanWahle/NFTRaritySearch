import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

class Apirequest extends React.Component {
  state = { contractAddress: "" };
  onSearchSubmit = async (term) => {
    const response = await axios.get(
      "https://api.opensea.io/api/v1/collection/" + term,
      {}
    );
    this.setState({
      contractAddress:
        response.data.collection.primary_asset_contracts[0].address,
    });
  };

  render() {
    return (
      <div className="ui container" style={{ marginTop: "10px" }}>
        <SearchBar onSubmit={this.onSearchSubmit} />
        {this.state.contractAddress}
      </div>
    );
  }
}

export default Apirequest;
