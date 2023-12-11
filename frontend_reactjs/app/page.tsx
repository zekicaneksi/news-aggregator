"use client";

import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";

function News() {
  return (
    <Box width={350} height={500}>
      <Typography>
        Death of cyclist in Berlin provokes debate over road protests
      </Typography>
      <Typography>theguardian.com</Typography>
      <img
        src={
          "https://media.guim.co.uk/02e7c96dc4d65e549854189ddf60ae54ffe69f43/0_170_5200_3120/500.jpg"
        }
        width={"100%"}
        height={200}
        alt={"alt"}
      />
      <Typography>
        he death of a cyclist after a traffic collision in Berlin has revived a
        growing debate in Germany about climate crisis protests. Sandra Umann,
        44, was severely injured last Monday when her bike collided with a
        cement mixer lorry when she was cycling to wor...
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography>James Dean</Typography>
        <Typography>2023/12/24</Typography>
      </Box>
    </Box>
  );
}

export default function Home() {
  async function foo() {
    let res = await fetch("/api/fetch-news-local");
    console.log(res);
  }

  const testArr = ["hello", "hello1", "hello2", "abc", "abc2"];

  return (
    <Container
      maxWidth={"md"}
      sx={{ backgroundColor: "#464242", minHeight: "100vh" }}
    >
      <Grid container>
        <Grid item xs={5}>
          <TextField label="search keyword..." variant="standard">
            search...
          </TextField>
        </Grid>
        <Grid item xs={7}>
          <Typography sx={{ float: "right" }}>
            You can sign in to personalize your feed
          </Typography>
          <Button
            sx={{ float: "right" }}
            variant="contained"
            color="secondary"
            size="medium"
          >
            SIGN IN
          </Button>
        </Grid>
        <Typography variant="h4">LATEST NEWS</Typography>
        <Grid container sx={{ border: "5px solid black" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={testArr}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={testArr}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={testArr}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={testArr}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <News />
          <News />
          <News />
          <News />
        </Box>
      </Grid>
    </Container>
  );
}
