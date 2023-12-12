"use client";

import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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

type Category = {
  id: number;
  name: string;
};

type Source = {
  id: number;
  name: string;
};

type Keyword = {
  id: number;
  name: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesValue, setCategoriesValue] = useState<Category | null>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [sourcesValue, setSourcesValue] = useState<Source | null>(null);

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordsValue, setKeywordsValue] = useState<Keyword | null>(null);
  const [keywordsInputValue, setKeywordsInputValue] = useState<string>("");

  async function fetchBackend(route: string) {
    const res = await fetch("/api" + route);
    return res;
  }

  async function getCategories() {
    let res = await fetchBackend("/get-categories");
    const content = await res.json();
    if (content.length !== 0) setCategories(content);
  }

  async function getSources() {
    let res = await fetchBackend("/get-sources");
    const content = await res.json();
    if (content.length !== 0) setSources(content);
  }

  useEffect(() => {
    if (categories.length === 0) getCategories();
  }, [categories]);

  useEffect(() => {
    if (sources.length === 0) getSources();
  }, [sources]);

  useEffect(() => {
    let ignore = false;

    async function getKeywords() {
      let res = await fetchBackend(
        "/get-keywords?search=" + keywordsInputValue,
      );
      const content = await res.json();

      if (!ignore) setKeywords(content);
    }

    const delayDebounceFn = setTimeout(() => {
      getKeywords();
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
      ignore = true;
    };
  }, [keywordsInputValue]);

  const testArr = ["hello", "hello1", "hello2", "abc", "abc2"];

  return (
    <Container
      maxWidth={"md"}
      sx={{ backgroundColor: "#464242", minHeight: "100vh" }}
    >
      <Grid container>
        <Grid item xs={5}>
          <Autocomplete
            disablePortal
            inputValue={keywordsInputValue}
            onInputChange={(event, newInputValue) => {
              setKeywordsInputValue(newInputValue);
            }}
            value={keywordsValue}
            onChange={(event: any, newValue: Keyword | null) => {
              setKeywordsValue(newValue);
            }}
            id="auto-complete-keyword"
            options={keywords}
            getOptionLabel={(option) => option.name}
            sx={{ width: 150 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search keyword..."
                variant={"standard"}
              />
            )}
          />
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
              value={categoriesValue}
              onChange={(event: any, newValue: Category | null) => {
                setCategoriesValue(newValue);
              }}
              id="auto-complete-category"
              options={categories}
              getOptionLabel={(option) => option.name}
              sx={{ width: 150 }}
              renderInput={(params) => (
                <TextField {...params} label="Category" variant={"standard"} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              value={sourcesValue}
              onChange={(event: any, newValue: Source | null) => {
                setSourcesValue(newValue);
              }}
              id="auto-complete-source"
              options={sources}
              getOptionLabel={(option) => option.name}
              sx={{ width: 150 }}
              renderInput={(params) => (
                <TextField {...params} label="Source" variant={"standard"} />
              )}
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
