import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export const Result = ({ title, hash, description, lastSeen, score, size }) => {
  var titleText = document.createElement("div");
  titleText.innerHTML = title;
  titleText = titleText.textContent || titleText.innerText || "";

  var descriptionText = document.createElement("div");
  descriptionText.innerHTML = description;
  var descriptionText =
    descriptionText.textContent || descriptionText.innerText || "";

  if (title != null && title != "") {
    return (
      <div style={{ paddingTop: "2em" }}>
        <Card style={{ maxWidth: "345" }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                <a href={"https://cloudflare-ipfs.com/ipfs/" + hash}>
                  {titleText}
                </a>
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
            <Button size="medium" color="primary">
              Metadata
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  } else {
    return <div></div>;
  }
};
