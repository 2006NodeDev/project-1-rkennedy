//Done!
import React, { FunctionComponent } from 'react';
import { withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import { Link } from 'react-router-dom';

const SignUpButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText('#ffb2e6'),
    backgroundColor: "'#ffb2e6'",
    '&:hover': {
      backgroundColor: '#1c3041',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: { //figure out spacing for this (so it's relative to screen size and centered)
    margin: "auto",
    maxWidth: 650,
    justifyContent: "center",
  },
  text: {
    fontFamily:"Ubuntu",
    color:"black"
  },
  submit: {
    margin: theme.spacing(1),
    backgroundColor: '#ffb2e6',
    color: 'purple',
    fontFamily: "Ubuntu",
    fontSize: 20,
  }
}));

export const HomeComponent:FunctionComponent<any> = (props) =>{
  const classes = useStyles();

  return (
    <Card className={classes.root}>
        {/* <CardMedia  /> 
        Insert zodiac image here!*/}
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2" className={classes.text}>
                By the Stars!                 
            </Typography>
            <Typography variant="body1" component="p" className={classes.text}>
                "Learn more about those around you by harnessing the cosmic powers of old!
                Compare your charts, find your compatibility."            </Typography>
        </CardContent>
        <CardActions className={classes.root}>
            <Link to= "/register" style={{ textDecoration:"none"}}><SignUpButton variant="contained" className={classes.submit}>
              Register Now!
            </SignUpButton></Link>  
             or  <Link to="/login" className={classes.text}>Login</Link>
        </CardActions>
    </Card>
  )
}