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
import { Category, Keyword, TNews, Source } from "./_components/News";
import News from "./_components/News";

export default function Home() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<"personal" | "general">(
    "general",
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoriesValue, setCategoriesValue] = useState<Category | null>(null);

  const [sources, setSources] = useState<Source[] | null>(null);
  const [sourcesValue, setSourcesValue] = useState<Source | null>(null);

  const [keywords, setKeywords] = useState<Keyword[] | null>(null);
  const [keywordsValue, setKeywordsValue] = useState<Keyword | null>(null);
  const [keywordsInputValue, setKeywordsInputValue] = useState<string>("");

  const [dateFromValue, setDateFromValue] = useState<Dayjs | null>(null);
  const [dateToValue, setDateToValue] = useState<Dayjs | null>(null);

  const [news, setNews] = useState<TNews[] | null>(null);

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
    if (selectedTab === "personal") addQueryParameter("personalized", "yes");

    addQueryParameter("page", news ? news.length / 10 : 0);
    fetchString = fetchString.slice(0, -1);

    let res = await fetchBackend(fetchString);
    let content = await res.json();
    setNews((prev) => {
      if (
        prev !== null &&
        content[0] &&
        content[0].id !== prev[prev.length - 10].id
      ) {
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
    selectedTab,
  ]);

  useEffect(() => {
    if (categories === null) getCategories();
  }, [categories]);

  useEffect(() => {
    if (sources === null) getSources();
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
      <Button
        variant={"contained"}
        onClick={getNews}
        sx={{ margin: "1.5em auto", display: "block" }}
      >
        Load More
      </Button>
    );

  let renderProfile;
  if (isAuthenticated === null) renderProfile = null;
  else if (isAuthenticated === false) {
    renderProfile = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "end",
        }}
      >
        <Typography sx={{ float: "right", margin: "1em" }}>
          You can sign in to personalize your feed
        </Typography>
        <Button
          sx={{ float: "right", marginRight: "1em" }}
          variant="contained"
          color="secondary"
          size="medium"
          onClick={() => {
            router.push("/login");
          }}
        >
          SIGN IN
        </Button>
      </Box>
    );
  } else {
    renderProfile = (
      <>
        <Button
          sx={{ float: "right", margin: "1em" }}
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
          sx={{ float: "right", margin: "1em" }}
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
            options={keywords ? keywords : []}
            getOptionLabel={(option) => option.name}
            sx={{ width: 150, margin: "1em" }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            flexWrap: "wrap",
            margin: "1em",
          }}
        >
          <Typography
            variant="h5"
            className={styles.newsTabs}
            onClick={() => {
              setSelectedTab("general");
            }}
            sx={{
              backgroundColor: selectedTab === "general" ? "#ccc" : "#909090",
            }}
          >
            LATEST NEWS
          </Typography>
          {isAuthenticated && (
            <Typography
              variant="h5"
              className={styles.newsTabs}
              onClick={() => {
                setSelectedTab("personal");
              }}
              sx={{
                backgroundColor:
                  selectedTab === "personal" ? "#ccc" : "#909090",
              }}
            >
              PERSONAL FEED
            </Typography>
          )}
        </Box>
        <Grid
          container
          sx={{
            border: "5px solid black",
            borderRadius: "1em",
            padding: "0.5em",
            margin: "1em",
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              disablePortal
              value={categoriesValue}
              onChange={(_: any, newValue: Category | null) => {
                setCategoriesValue(newValue);
              }}
              id="auto-complete-category"
              options={categories ? categories : []}
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
              options={sources ? sources : []}
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
            gap: "1em",
          }}
        >
          {renderNews}
        </Box>
      </Grid>
      {renderLoadMore}
    </Container>
  );
}
