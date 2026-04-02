import React, { useState } from "react";
import { Box, Container, Stack, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import axios from "../../../api/axios";
import { getApiUrl } from "../../../lib/config";

export default function HelpPage() {
  const [value, setValue] = React.useState("1");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  /** HANDLERS **/
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(getApiUrl("help"), formData)
      .then((res) => {
        console.log("Help sent:", res.data);
        alert("Your message has been sent!");
      })
      .catch((err) => {
        console.error("Help error:", err);
        alert("Failed to send message");
      });
  };

  return (
    <div className={"help-page"}>
      <Container className={"help-container"}>
        <TabContext value={value}>
          <Box className={"help-menu"}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                className={"table_list"}
              >
                <Tab label="TERMS" value={"1"} />
                <Tab label="FAQ" value={"2"} />
                <Tab label="CONTACT" value={"3"} />
              </Tabs>
            </Box>
          </Box>
          <Stack>
            <Stack className={"help-main-content"}>
              <TabPanel value={"1"}>
                <Stack className={"rules-box"}>
                  <Box className={"rules-frame"}>
                    {terms.map((value, number) => {
                      return <p key={number}>{value}</p>;
                    })}
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={"2"}>
                <Stack className={"accordion-menu"}>
                  {faq.map((value, number) => {
                    return (
                      <Accordion key={number}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{value.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{value.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              </TabPanel>
              <TabPanel value={"3"}>
                <Stack className={"admin-letter-box"}>
                  <Stack className={"admin-letter-container"}>
                    <Box className={"admin-letter-frame"}>
                      <span>Contact us!</span>
                      <p>Fill out below form to send a message!</p>
                    </Box>
                    <form onSubmit={handleSubmit} className={"admin-letter-frame"}>
                      <div className={"admin-input-box"}>
                        <label>Your name</label>
                        <input
                          type={"text"}
                          name={"name"}
                          placeholder={"Type your name here"}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Your email</label>
                        <input
                          type={"text"}
                          name={"email"}
                          placeholder={"Type your email here"}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Subject</label>
                        <input
                          type={"text"}
                          name={"subject"}
                          placeholder={"Topic"}
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Phone</label>
                        <input
                          type={"text"}
                          name={"phone"}
                          placeholder={"Type your phone here"}
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Message</label>
                        <textarea
                          name={"message"}
                          placeholder={"Your message"}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                          }
                        ></textarea>
                      </div>
                      <Box
                        display={"flex"}
                        justifyContent={"flex-end"}
                        sx={{ mt: "30px" }}
                      >
                        <Button type={"submit"} variant="contained">
                          Send
                        </Button>
                      </Box>
                    </form>
                  </Stack>
                </Stack>
              </TabPanel>
            </Stack>
          </Stack>
        </TabContext>
      </Container>
    </div>
  );
}
