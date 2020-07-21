import React, { FunctionComponent } from "react"
import { User } from '../../models/User'
import { makeStyles, Typography, CardContent, Card, CardMedia } from "@material-ui/core"

interface IUserDisplayProps {
    user:User
}
const useStyles = makeStyles({
  root: {
    margin: "auto",
    minWidth: 275,
    maxWidth:500
  },
  media: {
    height:"auto",
    width: "100%",
    margin: "auto",
  },
  username: {
    fontSize: 20,
    fontFamily: "Ubuntu"
  },
  userInfo: {
    color: "textSecondary",
    fontFamily: "Ubuntu"
  },
})

export const UserDisplayComponent: FunctionComponent<IUserDisplayProps> = (props) =>{ 
    let classes = useStyles();
    return (
      <Card className={classes.root} >
        <CardContent>
        <CardMedia
          component = "img"
          className={classes.media}
          alt="Profile Picture"
          image={props.user.image} 
        />
          <Typography className={classes.username} gutterBottom>
            Username : {props.user.username}
          </Typography>
          <Typography className={classes.userInfo}>
            Password : {props.user.password}
          </Typography>
          <Typography className={classes.userInfo}>
              First Name : {props.user.firstName}
          </Typography>
          <Typography className={classes.userInfo}>
              Last Name : {props.user.lastName}
          </Typography>
          <Typography className={classes.userInfo}>
              Email : {props.user.email}
          </Typography>
          <Typography className={classes.userInfo}>
              Role : {props.user.role}
          </Typography>
        </CardContent>
        {/* <CardActions>
           <Button size="small">Update User</Button>
          We want this to be the button to press to update profile
        </CardActions> */}
      </Card>
    );
}