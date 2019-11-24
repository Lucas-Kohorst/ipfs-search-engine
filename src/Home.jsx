import React from "react";
import SearchBar from "material-ui-search-bar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const Result = ({ title, hash, description, lastSeen, score, size }) => {
  var titleText = document.createElement("div");
  titleText.innerHTML = title;
  titleText = titleText.textContent || titleText.innerText || "";

  var descriptionText = document.createElement("div");
  descriptionText.innerHTML = description;
  var descriptionText = descriptionText.textContent || descriptionText.innerText || "";

  if (title != null && title != "") {
    return (
      <div style={{ paddingTop: "2em" }}>
        <Card style={{ maxWidth: "345" }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                <a href={"https://cloudflare-ipfs.com/ipfs/" + hash}>{titleText}</a>
              </Typography>
              <Typography variant="body" color="textSecondary" component="p">
                {descriptionText}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Typography variant="body" color="textSecondary" component="p">
              {score ? "Score: " + score : ""}
            </Typography>
            <Typography variant="body" color="textSecondary" component="p">
              {size ? "Size: " + size + " bytes" : ""}
            </Typography>
            <Typography variant="body" color="textSecondary" component="p">
              {lastSeen ? "Last seen: " + lastSeen.split("T")[0] : ""}
            </Typography>
          </CardActions>
        </Card>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const Wiki = ({ title, about, link }) => {
  if (about != null && about != "") {
    return (
      <Card style={{ maxWidth: "345" }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body" color="textSecondary" component="p">
              {about}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="medium" color="primary">
            <a href={link}>Wiki</a>
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    return <div></div>;
  }
};

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

  _search = query => {
    this.setState({
      wiki: null,
      title: null,
      results: null
    });
    var queryArray = []
    if (query.includes(" ")) {
      queryArray = query.split(" ")
            query = "";
      for (var i = 0;  i < queryArray.length; i++) {
        queryArray[i] = queryArray[i][0].toUpperCase() + queryArray[i].slice(1).toLowerCase();
        if (i < queryArray.length - 1) {
          query += queryArray[i] + "_"
        } else {
          query += queryArray[i]
        }
      }
      console.log(query)
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
  };

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
              height: "40vh"
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
          </div>
        ) : (
          <div style={{ display: "flex", padding: "2em" }}>
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
            width: "60%",
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
            href="https://github.com/Lucas-Kohorst/ipfs-search-react"
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
