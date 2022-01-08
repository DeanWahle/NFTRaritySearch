import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

/*
Todo, I actually realized I can go completely around the contract
address route and literally just grab the assets with the 
collection name and process the traits that way, 

Im not really sure why i needed the contract address in the first place
*/

//TODO
/*
Currently, the program is working, except for collections 
that are on asset contracts that are shared with other collections. 
Since we retrieve the assets based on the asset contract address, any contract with multiple collections
will return the rarest NFT out of all the collections on that contract. 

TODO: is to figure out why collections would ever share a contract, and 
figure out how to differentiate between collections on a contract that 
contains multiple
*/

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
    this.setState({
      minIdx: this.state.values.indexOf(Math.min(...this.state.values)),
    });
  };

  findNum = (asset) => {
    //console.log(asset.name);
    let curr = 1;
    asset.traits.map((trait) => {
      if (trait.trait_count !== 0) {
        let mult = trait.trait_count / 10000;
        curr *= mult;
      }
    });
    this.setState({
      values: [...this.state.values, curr],
      names: [...this.state.names, asset.name],
    });
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
      //console.log(this.state.contractAddress);
      this.setState({ processed: i });
      collectionInfo.data.assets.map((asset) => {
        return this.findNum(asset, i);
      });
    }
  };

  findCollectionSize = async (term) => {
    const response = await axios.get(
      "https://api.opensea.io/api/v1/collection/" + term,
      {}
    );
    this.setState({ loopSize: response.data.collection.stats.count });
  };

  onSearchSubmit = async (term) => {
    this.setState({ values: [], names: [] });
    const response = await axios.get(
      "https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&limit=50&collection=" +
        term,
      {}
    );
    this.setState(
      {
        contractAddress: response.data.assets[0].asset_contract.address,
      },
      () => {
        this.findCollectionSize(response.data.assets[0].collection.slug).then(
          this.afterSetStateFinished().then(this.findMin)
        );
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
