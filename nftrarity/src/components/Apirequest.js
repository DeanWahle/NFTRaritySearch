import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

//TODO
//Soccer doge club isnt finding the correct NFT
//I think the issue is that right now iM going off the index of the
//Lowest value, but if the colleciton was added out of order
//this wont work
//So we need to add the names of the nfts to another array
//and then access the index of the "minimum" in the names array

class Apirequest extends React.Component {
  state = {
    contractAddress: "",
    processed: 0,
    values: [],
    names: [],
    minNum: 99999,
    minIdx: -1,
    loopSize: 0,
  };

  findMin = () => {
    let i = 0;
    this.state.values.map((num) => {
      console.log(this.state.names[i] + " " + num);
      i++;
    });
    this.setState({
      minIdx: this.state.values.indexOf(Math.min(...this.state.values)),
    });
  };

  findNum = (asset) => {
    let curr = 1;
    asset.traits.map((trait) => {
      if (trait.trait_count !== 0) {
        let mult = trait.trait_count / 10000;
        curr *= mult;
      }
    });
    console.log(asset);
    this.setState({
      values: [...this.state.values, curr],
      names: [...this.state.names, asset.name],
    }); //simple value
  };

  afterSetStateFinished = async () => {
    for (let i = 0; i < this.state.loopSize + 51; i += 50) {
      const collectionInfo = await axios.get(
        "https://api.opensea.io/api/v1/assets?order_direction=asc&offset=" +
          i +
          "&limit=50&asset_contract_address=" +
          this.state.contractAddress,
        {}
      );
      this.setState({ processed: i });
      collectionInfo.data.assets.map((asset) => {
        //console.log(asset);
        return this.findNum(asset, i);
      });
    }
  };

  onSearchSubmit = async (term) => {
    this.setState({ values: [], names: [] });
    const response = await axios.get(
      "https://api.opensea.io/api/v1/collection/" + term,
      {}
    );
    this.setState(
      {
        contractAddress:
          response.data.collection.primary_asset_contracts[0].address,
        loopSize: response.data.collection.stats.count,
      },
      () => {
        this.afterSetStateFinished().then(this.findMin);
      }
    );
  };

  render() {
    return (
      <div className="ui container" style={{ marginTop: "10px" }}>
        <SearchBar onSubmit={this.onSearchSubmit} />
        <div>
          Processed: {this.state.processed} / {this.state.loopSize + 1}
        </div>
        <div>Rarest: {this.state.names[this.state.minIdx]}</div>
      </div>
    );
  }
}

export default Apirequest;
// <DataGather contractAddress={this.state.contractAddress} />
