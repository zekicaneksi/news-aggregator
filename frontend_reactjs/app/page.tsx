"use client";

import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { fetchBackend } from "./_components/helper_functions";
import { useRouter } from "next/navigation";

function News(props: News) {
  return (
    <Box width={350} height={500}>
      <Typography>{props.headline}</Typography>
      <Typography>{props.source_name}</Typography>
      <img src={props.multimedia_url} width={"100%"} height={200} alt={"alt"} />
      <Typography>{props.lead_paragraph}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography>
          {props.author_name ? props.author_name : "unknown"}
        </Typography>
        <Typography>{props.date}</Typography>
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

type News = {
  id: number;
  headline: string;
  multimedia_url: string;
  lead_paragraph: string;
  category_name: number;
  date: string;
  source_name: number;
  author_name: number;
  external_link: string;
};

export default function Home() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesValue, setCategoriesValue] = useState<Category | null>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [sourcesValue, setSourcesValue] = useState<Source | null>(null);

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordsValue, setKeywordsValue] = useState<Keyword | null>(null);
  const [keywordsInputValue, setKeywordsInputValue] = useState<string>("");

  const [dateFromValue, setDateFromValue] = useState<Dayjs | null>(null);
  const [dateToValue, setDateToValue] = useState<Dayjs | null>(null);

  const [news, setNews] = useState<News[] | null>(null);

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

  async function getNews() {
    let fetchString = "/get-news?";

    function addQueryParameter(queryName: string, queryValue: string | number) {
      fetchString += queryName + "=" + queryValue + "&";
    }

    if (categoriesValue !== null)
      addQueryParameter("category_id", categoriesValue.id);
    if (sourcesValue !== null) addQueryParameter("source_id", sourcesValue.id);
    if (keywordsValue !== null)
      addQueryParameter("keyword_id", keywordsValue.id);
    if (dateFromValue !== null)
      addQueryParameter("date_from", dateFromValue.format("YYYY/MM/DD"));
    if (dateToValue !== null)
      addQueryParameter("date_to", dateToValue.format("YYYY/MM/DD"));

    addQueryParameter("page", news ? news.length / 10 : 0);
    fetchString = fetchString.slice(0, -1);

    let res = await fetchBackend(fetchString);
    let content = await res.json();
    setNews((prev) => {
      if (prev !== null && content[0].id !== prev[prev.length - 10].id) {
        let toReturn = [...prev, ...content];
        return toReturn;
      } else {
        return content;
      }
    });
  }

  useEffect(() => {
    async function checkAuth() {
      const res = await fetchBackend("/check-auth");
      if (res.status === 200) setIsAuthenticated(true);
      else setIsAuthenticated(false);
    }
    if (isAuthenticated === null) checkAuth();
  }, [isAuthenticated]);

  useEffect(() => {
    if (news === null) getNews();
  }, [news]);

  useEffect(() => {
    setNews(null);
  }, [
    categoriesValue,
    sourcesValue,
    keywordsInputValue,
    dateFromValue,
    dateToValue,
  ]);

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

  let renderNews;

  if (news === null) {
    renderNews = <CircularProgress />;
  } else if (news.length === 0) {
    renderNews = (
      <Typography>No news could be found with given filters.</Typography>
    );
  } else {
    renderNews = news.map((elem) => {
      return <News {...elem} key={elem.id} />;
    });
  }

  let renderLoadMore;
  if (news === null) renderLoadMore = null;
  else if (Math.floor(news.length / 10) == 0)
    renderLoadMore = <Typography>End of results</Typography>;
  else
    renderLoadMore = (
      <Button variant={"contained"} onClick={getNews}>
        Load More
      </Button>
    );

  let renderProfile;
  if (isAuthenticated === null) renderProfile = null;
  else if (isAuthenticated === false) {
    renderProfile = (
      <>
        <Typography sx={{ float: "right" }}>
          You can sign in to personalize your feed
        </Typography>
        <Button
          sx={{ float: "right" }}
          variant="contained"
          color="secondary"
          size="medium"
          onClick={() => {
            router.push("/login");
          }}
        >
          SIGN IN
        </Button>
      </>
    );
  } else {
    renderProfile = (
      <>
        <Button
          sx={{ float: "right" }}
          variant="contained"
          color="secondary"
          size="medium"
          onClick={() => {
            router.push("/preferences");
          }}
        >
          Preferences
        </Button>
        <Button
          sx={{ float: "right" }}
          variant="contained"
          color="secondary"
          size="medium"
          onClick={async () => {
            await fetch("/api/logout", {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
            });
            setIsAuthenticated(false);
          }}
        >
          SIGN OUT
        </Button>
      </>
    );
  }

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
            onInputChange={(_, newInputValue) => {
              setKeywordsInputValue(newInputValue);
            }}
            value={keywordsValue}
            onChange={(_: any, newValue: Keyword | null) => {
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
          {renderProfile}
        </Grid>
        <Typography variant="h4">LATEST NEWS</Typography>
        <Grid container sx={{ border: "5px solid black" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              value={categoriesValue}
              onChange={(_: any, newValue: Category | null) => {
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
              onChange={(_: any, newValue: Source | null) => {
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
            <DatePicker
              label={"From"}
              value={dateFromValue}
              onChange={(newValue) => setDateFromValue(newValue)}
              maxDate={dayjs()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label={"To"}
              value={dateToValue}
              onChange={(newValue) => setDateToValue(newValue)}
              maxDate={dateFromValue}
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
          {renderNews}
        </Box>
      </Grid>
      {renderLoadMore}
    </Container>
  );
}
