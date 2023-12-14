import { Box, Typography } from "@mui/material";

export type Category = {
  id: number;
  name: string;
};

export type Source = {
  id: number;
  name: string;
};

export type Keyword = {
  id: number;
  name: string;
};

export type TNews = {
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

export default function News(props: TNews) {
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
