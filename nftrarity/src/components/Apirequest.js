import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

//TODO on line 124 watch stephen grider's tutorial on rendering lists and apply it to
//the NFTs we are retrieving
//Should probably make this a separate component and just pass down the contract address with the
//top five tokens because this component is getting very crowded

class Apirequest extends React.Component {
  state = {
    contractAddress: "",
    processed: 0,
    values: [],
    names: [],
    tokenIds: [],
    topFiveTokenIds: [],
    cards: [],
    minNum: 99999,
    minIdx: -1,
    loopSize: 0,
    searchTerm: "",
  };
  //https://api.opensea.io/api/v1/asset/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/8348/
  renderRarest = async () => {
    //console.log("Render Rarest");
    var response;
    for (let i = 0; i < 5; i++) {
      this.setState({
        cards: [
          ...this.state.cards,
          await axios.get(
            "https://api.opensea.io/api/v1/asset/" +
              this.state.contractAddress +
              "/" +
              this.state.topFiveTokenIds[i] +
              "/"
          ),
        ],
      });
    }
  };

  findAddress = async (term) => {
    const response = await axios.get(
      "https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&limit=50&collection=" +
        term,
      {}
    );
    this.setState({
      contractAddress: response.data.assets[0].asset_contract.address,
    });
  };

  findMin = () => {
    let i = 0;
    this.setState({
      minIdx: this.state.values.indexOf(Math.min(...this.state.values)),
    });
    var topValues = [...this.state.values];
    var topFive = topValues.sort((a, b) => a - b).slice(0, 5);
    console.log(topFive);
    for (let i = 0; i < 5; i++) {
      this.setState({
        topFiveTokenIds: [
          ...this.state.topFiveTokenIds,
          this.state.tokenIds[this.state.values.indexOf(topFive[i])],
        ],
      });
    }
  };

  findNum = (asset) => {
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
      tokenIds: [...this.state.tokenIds, asset.token_id],
    });
  };

  afterSetStateFinished = async (term) => {
    for (let i = 0; i < this.state.loopSize + 51; i += 50) {
      const collectionInfo = await axios.get(
        "https://api.opensea.io/api/v1/assets?order_direction=asc&offset=" +
          i +
          "&limit=50&collection=" +
          term,
        {}
      );
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

  onSearchSubmit = (term) => {
    this.setState({ values: [], names: [], searchTerm: term });
    this.findCollectionSize(term).then(
      this.afterSetStateFinished(term)
        .then(this.findMin)
        .then(this.findAddress(term))
        .then(this.renderRarest)
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
        {this.state.cards.map((item) => console.log(item))}
      </div>
    );
  }
}

export default Apirequest;
