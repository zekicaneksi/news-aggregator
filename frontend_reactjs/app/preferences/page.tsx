"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useMemo, useState } from "react";

import { fetchBackend } from "../_components/helper_functions";
import { useRouter } from "next/navigation";

type Preference = {
  id: number;
  preference_type_id: number;
  preference_target_id: number;
};

type PreferenceTarget = {
  id: number;
  name: string;
};

type PreferenceList = {
  id: number;
  name: string;
  preference_list: Preference[];
  whole_list: PreferenceTarget[];
};

function PreferenceList(props: {
  preferenceList: PreferenceList;
  setPreferenceList: Function;
  title: string;
}) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sortedArr = useMemo(() => {
    const toSort = props.preferenceList.whole_list.map((elem) => {
      return {
        ...elem,
        favorite: props.preferenceList.preference_list.find(
          (elem_find) => elem_find.preference_target_id === elem.id,
        )
          ? true
          : false,
      };
    });
    return toSort.sort((elem1, elem2) => {
      if (elem1.favorite && elem2.favorite) return 0;
      else if (elem1.favorite) return -1;
      else return 1;
    });
  }, [props.preferenceList]);

  const searchedArr = sortedArr.filter((elem) =>
    elem.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Box width={"15em"} margin={"2em"}>
      <Typography variant={"h4"} sx={{ textAlign: "center" }}>
        {props.title}
      </Typography>
      <TextField
        disabled={isLoading ? true : false}
        size={"small"}
        placeholder="search..."
        fullWidth
        value={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
        }}
      />
      <Box width={"100%"} height={"20em"} overflow={"scroll"}>
        <List sx={{ backgroundColor: "#808080" }}>
          {searchedArr.map((elem) => {
            return (
              <ListItemButton
                key={elem.id}
                onClick={async () => {
                  if (!elem.favorite) {
                    setIsLoading(true);
                    const res = await fetchBackend(
                      "/add-preference?preference_type_id=" +
                        props.preferenceList.id +
                        "&preference_target_id=" +
                        elem.id,
                    );
                    const insertedId = (await res.json()).last_insert_id;
                    props.setPreferenceList((prev: PreferenceList) => {
                      let toReturn = { ...prev };
                      toReturn.preference_list.push({
                        id: insertedId,
                        preference_type_id: props.preferenceList.id,
                        preference_target_id: elem.id,
                      });
                      return toReturn;
                    });
                    setIsLoading(false);
                  } else {
                    setIsLoading(true);
                    const findItem = props.preferenceList.preference_list.find(
                      (elemFind) => elemFind.preference_target_id === elem.id,
                    );
                    let user_preference_id: number;
                    if (findItem) user_preference_id = findItem.id;
                    else return;
                    await fetchBackend(
                      "/delete-preference?user_preference_id=" +
                        user_preference_id,
                    );
                    props.setPreferenceList((prev: PreferenceList) => {
                      let toReturn = { ...prev };
                      toReturn.preference_list =
                        toReturn.preference_list.filter(
                          (elemFilter) => elemFilter.id !== user_preference_id,
                        );
                      return toReturn;
                    });
                    setIsLoading(false);
                  }
                }}
              >
                <ListItemIcon>
                  {elem.favorite && <RemoveCircleOutlineIcon />}
                </ListItemIcon>
                <ListItemText primary={elem.name} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}

export default function Page() {
  const router = useRouter();

  const [categories, setCategories] = useState<PreferenceList | null>(null);
  const [authors, setAuthors] = useState<PreferenceList | null>(null);
  const [sources, setSources] = useState<PreferenceList | null>(null);

  async function getPreference(
    preference_name: string,
    wholeListRoute: string,
    setState: (arg: PreferenceList) => void,
  ) {
    let res_checkPreference = await fetchBackend(
      "/check-preference?preference_name=" + preference_name,
    );
    const content_checkPreference = await res_checkPreference.json();

    let res_wholeList = await fetchBackend(wholeListRoute);
    const content_wholeList = await res_wholeList.json();

    const res_preference = await fetchBackend(
      "/get-preferences?preference_name=" + preference_name,
    );
    const content_preference = await res_preference.json();

    setState({
      whole_list: content_wholeList,
      preference_list: content_preference,
      id: content_checkPreference[0].id,
      name: content_checkPreference[0].name,
    });
  }

  useEffect(() => {
    async function checkAuth() {
      const res = await fetchBackend("/check-auth");
      if (res.status !== 200) router.push("/");
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (categories === null)
      getPreference("category", "/get-categories", setCategories);
    if (authors === null) getPreference("author", "/get-authors", setAuthors);
    if (sources === null) getPreference("source", "/get-sources", setSources);
  }, [categories, authors, sources]);

  return (
    <Container sx={{ minHeight: "100vh", backgroundColor: "#595353" }}>
      <Button variant={"contained"} onClick={() => router.push("/")}>
        Back to News
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {categories ? (
          <PreferenceList
            preferenceList={categories}
            setPreferenceList={setCategories}
            title={"Categories"}
          />
        ) : (
          <CircularProgress />
        )}
        {sources ? (
          <PreferenceList
            preferenceList={sources}
            setPreferenceList={setSources}
            title={"Sources"}
          />
        ) : (
          <CircularProgress />
        )}
        {authors ? (
          <PreferenceList
            preferenceList={authors}
            setPreferenceList={setAuthors}
            title={"Authors"}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
}
