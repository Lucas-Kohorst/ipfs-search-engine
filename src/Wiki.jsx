import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export const Wiki = ({ title, about, link }) => {
  if (about != null && about != "") {
    return (
      <Card style={{ maxWidth: "345" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title.includes("_") ? title.replace("_", " ") : title}
          </Typography>
          <Typography variant="body" color="textSecondary" component="p">
            {about}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="medium" color="primary">
            <a href={link}>Wiki</a>
          </Button>
          <Typography variant="body" color="textSecondary" component="p">
            <div>
              <p>
                Created on: 2017-05 from the{" "}
                <a href="http://wiki.kiwix.org/wiki/Content_in_all_languages">
                  kiwix ZIM file
                </a>
              </p>
            </div>
          </Typography>
        </CardActions>
      </Card>
    );
  } else {
    return <div></div>; 
  }
};