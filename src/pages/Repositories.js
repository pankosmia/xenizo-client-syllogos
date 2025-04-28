import React, { useState,useContext } from "react";
import { bcvContext } from "pithekos-lib";
import {
  Box,
  Typography,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArchivePage from "./Archives";
import PageProjectName from "./Project";
import Navigation from "../components/Navigation";
import NewContributionPage from "./NewContribution";
import moment from "moment";

const ExchangeData = () => {
  const [activeTab, setActiveTab] = useState("opened");
  moment.locale("en");

  const { bcvRef } = useContext(bcvContext);
  const bookName = bcvRef.current.bookCode;
  const chapter = bcvRef.current.chapterNum;
  const verse = bcvRef.current.verseNum;
  const nameProject = `${bookName}  ${chapter} : ${verse}`;

  return (
    <Box>
      <Navigation />
      <Box sx={{textAlign:"right", padding:2}}>
        <NewContributionPage />
      </Box>

      <Box sx={{ width: "auto", height: "auto", margin: "auto", padding: 3, minWidth:344, maxWidth:600}}>
        <Box
          sx={{
            border: "1px solid #ddd",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography className="sizeletters">{nameProject} </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Typography
              component="a"
              href="syllogos#/contribution"
              className={`tab ${
                activeTab === "opened" ? "active" : ""
              } custom-button-page-project`}
              onClick={() => setActiveTab("opened")}
            >
              <MessageIcon sx={{ marginRight: "8px" }} /> OPEN
            </Typography>

            <Typography
              component="a"
              className={`tab ${
                activeTab === "archived" ? "active" : ""
              } custom-button-page-project`}
              onClick={() => setActiveTab("archived")}
            >
              <ArchiveIcon sx={{ marginRight: "8px" }} /> RESOLVED
            </Typography>
          </Box>
          {activeTab === "opened" ? <PageProjectName /> : <ArchivePage />}
        </Box>
      </Box>
    </Box>
  );
};
export default ExchangeData;
