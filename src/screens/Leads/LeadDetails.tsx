import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Tag } from "antd";
import { Viewlead } from "../../services/LeadServices";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import ActivityTimeline from "./ActivityTimeline";
import Details from "./Details";
import Files from "./Files";
import UpdateLeadCard from "./UpdateLeadCard";


interface Lead {
  lead_name: string;
  company: string;
  Email: string;
  Phone: string;
  owner: string;
  Value: number;
  Source_Name: string;
  Stage_Name: string;
  Status_Name: string;
  Priority_Name: string;
}

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Activity Timeline";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await Viewlead(id);
      setLead(response.data);
    } catch (err) {
      console.error(err);
    }
  };


  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "new":
        return "blue";
      case "qualified":
        return "purple";
      case "proposal":
        return "orange";
      case "closed":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* 🔙 Back */}
      <div className="flex items-center gap-3 cursor-pointer">
         <Button className='arrow-icon' onClick={() => navigate('/leads')}>
           <ArrowLeftOutlined/>
        </Button>

        <div>
          <h1 className="text-xl font-bold">
            {lead?.lead_name || "Loading..."}
          </h1>
          <p className="text-gray-500">{lead?.company}</p>
        </div>
      </div>

      {/* 📊 Main Section */}
      <div className="flex gap-5 max-sm:flex-col">

        {/* 📄 Lead Info */}
        <Card style={{ width: "66.66%" }} className="hover-card max-sm:w-full!">
          {lead && (
            <div className="flex flex-col gap-4">

              {/* Contact Info */}
              <div className="flex flex-col gap-2">
                <p><MailOutlined /> {lead.Email}</p>
                <p><PhoneOutlined /> {lead.Phone}</p>
              </div>

              {/* 🎨 Tags */}
              <div className="flex gap-3 flex-wrap">
                <Tag color={getStageColor(lead.Stage_Name)}>
                  {lead.Stage_Name}
                </Tag>

                <Tag color={getStatusColor(lead.Status_Name)}>
                  {lead.Status_Name}
                </Tag>

                <Tag color={getPriorityColor(lead.Priority_Name)}>
                  {lead.Priority_Name}
                </Tag>
              </div>

              {/* 📌 Extra Info */}
              <div className="flex flex-col gap-1">
                <p><b>Owner:</b> {lead.owner}</p>
                <p><b>Value:</b> ₹{lead.Value}</p>
                <p><b>Source:</b> {lead.Source_Name}</p>
              </div>

            </div>
          )}
        </Card>

        {/* ⚡ Quick Actions */}
        <Card style={{ width: "30%" }} className="hover-card max-sm:w-full!">
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold">Quick Actions</h1>

            <Button size="large" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              <MailOutlined /> Send Email
            </Button>

            <Button size="large" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              <PhoneOutlined /> Make Call
            </Button>

            <Button size="large" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              <CalendarOutlined /> Schedule Meeting
            </Button>
          </div>
        </Card>
      </div>
      <div className="flex gap-5 w-full max-sm:flex-col max-sm:gap-5">
           {/* 📂 Tabs */}
      <div className="flex flex-col gap-4 w-4/6 max-sm:w-full">

        <div className="flex justify-evenly">
          {["Activity Timeline", "Details", "Files"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`setting-button ${activeTab === tab ? "active" : ""}`}
              style={{background:"var(--body-color)"}}
            >
              <div className={activeTab === tab ? "text-black" : "text-gray-600"}>
                {tab}
              </div>
            </Button>
          ))}
        </div>

        {/* 📌 Tab Content */}
        <div>
          {activeTab === "Activity Timeline" && <ActivityTimeline />}
          {activeTab === "Details" && <Details />}
          {activeTab === "Files" && <Files />}
        </div>
      </div>
      <UpdateLeadCard/>
       </div>
       <Card style={{width:"30%",alignSelf:"end",marginRight:"20px"}} 
        className="hover-card max-sm:w-full! max-sm:m-0!">
          <div className="w-full flex flex-col gap-4">
            <h1 className="text-lg font-bold">Schedule Follow-up</h1>
            <Button size="large"><CalendarOutlined/>Schedule Follow-up</Button>
          </div>
       </Card>
    </div>
  );
}

export default LeadDetails;