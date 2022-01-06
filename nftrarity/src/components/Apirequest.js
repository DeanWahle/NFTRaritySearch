import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import DataGather from "./DataGather";

class Apirequest extends React.Component {
  state = { contractAddress: "", processed: 0 };
  afterSetStateFinished = async () => {
    for (let i = 0; i < 10001; i += 50) {
      const collectionInfo = await axios.get(
        "https://api.opensea.io/api/v1/assets?order_direction=desc&offset=" +
          i +
          "&limit=50&asset_contract_address=" +
          this.state.contractAddress,
        {}
      );
      this.setState({ processed: i });
      //TODO, map response and find rarity values
      console.log(collectionInfo.data.assets);
    }
  };
  onSearchSubmit = async (term) => {
    const response = await axios.get(
      "https://api.opensea.io/api/v1/collection/" + term,
      {}
    );
    this.setState(
      {
        contractAddress:
          response.data.collection.primary_asset_contracts[0].address,
      },
      () => {
        this.afterSetStateFinished();
      }
    );
  };

  AddressFound = () => {
    console.log(this.state.contractAddress);
  };

  render() {
    return (
      <div className="ui container" style={{ marginTop: "10px" }}>
        <SearchBar onSubmit={this.onSearchSubmit} />
        Processed: {this.state.processed}
      </div>
    );
  }
}

export default Apirequest;
// <DataGather contractAddress={this.state.contractAddress} />
