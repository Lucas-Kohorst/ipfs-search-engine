import React from "react";
import SearchBar from "material-ui-search-bar";

import { Wiki } from "./Wiki"
import { Result } from "./Result"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      wiki: null,
      title: null,
      results: null
    };
  }

  _search = (query) => {
    this.setState({
      wiki: null,
      title: null,
      results: null
    });
    var queryArray = [];
    if (query.includes(" ")) {
      queryArray = query.split(" ");
      query = "";
      for (var i = 0; i < queryArray.length; i++) {
        queryArray[i] =
          queryArray[i][0].toUpperCase() + queryArray[i].slice(1).toLowerCase();
        if (i < queryArray.length - 1) {
          query += queryArray[i] + "_";
        } else {
          query += queryArray[i];
        }
      }
      console.log(query);
    }
    fetch("https://en.wikipedia-on-ipfs.org/wiki/" + query + ".html")
      .then(response => response.text())
      .then(data => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        this.setState({
          wiki: this._getElementByXpath(doc, "/html/body/div[1]/div/p[2]"),
          title: query
        });
      })
      .catch(error => console.error(error));
    fetch("https://api.ipfs-search.com/v1/search?q=" + query)
      .then(response => response.json())
      .then(data => {
        this.setState({
          results: data.hits
        });
      })
      .catch(error => console.error(error));
  }

  _getMetaData(hash) {
    fetch("https://api.ipfs-search.com/v1/metadata/" + hash)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => console.error(error));
  }

  _getElementByXpath(doc, path) {
    return doc.evaluate(path, doc, null, XPathResult.STRING_TYPE, null)
      .stringValue;
  }

  createCards = rows => {
    let results = [];
    for (var result in rows) {
      results.push(
        <Result
          title={rows[result].title}
          hash={rows[result].hash}
          description={rows[result].description}
          lastSeen={rows[result]["last-seen"]}
          score={rows[result].score}
          size={rows[result].size}
        />
      );
    }
    return results;
  };

  render() {
    return (
      <React.Fragment>
        {this.state.results === null ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "45vh"
            }}
          >
            <div style={{ padding: "2em" }}>
              <h1>InterPlanetary File System</h1>
              <h3>Search the Distributed Web</h3>
            </div>
            <SearchBar
              style={{ width: "50%" }}
              value={this.state.value}
              onChange={newValue => this.setState({ value: newValue })}
              onRequestSearch={() => this._search(this.state.value)}
              onCancelSearch={() => this.setState({ value: "" })}
            />
            <h5>
              Running your own{" "}
              <a href="https://docs.ipfs.io/introduction/usage/">IPFS node</a>{" "}
              will speed up your search and help others
            </h5>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2em"
            }}
          >
            <h1>Search the Distributed Web</h1>
            <SearchBar
              style={{ width: "60%" }}
              value={this.state.value}
              onChange={newValue => this.setState({ value: newValue })}
              onRequestSearch={() => this._search(this.state.value)}
              onCancelSearch={() => this.setState({ value: "" })}
            />
          </div>
        )}
        <div
          style={{
            textAlign: "left",
            padding: "2em"
          }}
        >
          <div>
            <Wiki
              title={this.state.title}
              about={this.state.wiki}
              link={
                "https://en.wikipedia-on-ipfs.org/wiki/" +
                this.state.title +
                ".html"
              }
            />
          </div>
          <div>{this.createCards(this.state.results)}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <a style={{ padding: "0.75em" }} href="http://ipfs-search.com/api">
            API
          </a>
          <a
            style={{ padding: "0.75em" }}
            href="https://github.com/Lucas-Kohorst/ipfs-search-engine"
          >
            Code
          </a>
          <a
            style={{ padding: "0.75em" }}
            href="mailto: kohorstlucas@gmail.com"
          >
            Contact
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export { Home };
