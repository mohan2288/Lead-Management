import { Button, Card, Input, Dropdown, Space } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { MenuProps } from "antd";
import "../../styles/Leads.css";
import LeadTable from "../../components/LeadTable";
import { lead } from "../../services/LeadServices";
import { toast } from "react-toastify";

function Leads() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const [leads, setLeads] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  const [status, setStatus] = useState("All Status");
  const [priority, setPriority] = useState("All Priority");
  const [stage, setStage] = useState("All Stages");

  // ✅ Dropdown Items
  const statusItems: MenuProps["items"] = [
    { key: "All Status", label: "All Status" },
    { key: "Active", label: "Active" },
    { key: "Contacted", label: "Contacted" },
    { key: "Qualified", label: "Qualified" },
    { key: "Unqualified", label: "Unqualified" },
    { key: "Archived", label: "Archived" },
  ];

  const priorityItems: MenuProps["items"] = [
    { key: "All Priority", label: "All Priority" },
    { key: "High", label: "High" },
    { key: "Medium", label: "Medium" },
    { key: "Low", label: "Low" },
  ];

  const stageItems: MenuProps["items"] = [
    { key: "All Stages", label: "All Stages" },
    { key: "New", label: "New" },
    { key: "Qualified", label: "Qualified" },
    { key: "Negotiation", label: "Negotiation" },
    { key: "Proposal", label: "Proposal" },
    { key: "Won", label: "Won" },
    { key: "Lost", label: "Lost" },
  ];

  // ✅ Dropdown handlers
  const statusMenu = {
    items: statusItems,
    onClick: ({ key }: { key: string }) => {
      setStatus(key);
      setPage(1);
    },
  };

  const priorityMenu = {
    items: priorityItems,
    onClick: ({ key }: { key: string }) => {
      setPriority(key);
      setPage(1);
    },
  };

  const stageMenu = {
    items: stageItems,
    onClick: ({ key }: { key: string }) => {
      setStage(key);
      setPage(1);
    },
  };

  // ✅ Fetch Leads (NO FILTERS)
  const fetchLeads = async () => {
    try {
      const response = await lead({ page, size });

      const data = response?.data || [];

      const formattedLeads = data.map((item: any) => ({
        id: item.Lead_ID,
        name: item.lead_name,
        company: item.company,
        email: item.Email,
        status: item.Status_Name,
        stage: item.Stage_Name,
        priority: item.Priority_Name,
        source: item.Source_Name,
        owner: item.owner,
        value: item.Value,
      }));

      setLeads(formattedLeads);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, size]);

  // ✅ UI FILTERING (Search + Dropdowns)
  const filteredLeads = leads.filter((lead) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(search) ||
      lead.company?.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search);

    const matchesStatus =
      status === "All Status" || lead.status === status;

    const matchesPriority =
      priority === "All Priority" || lead.priority === priority;

    const matchesStage =
      stage === "All Stages" || lead.stage === stage;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesStage
    );
  });

  return (
    <div className="w-full m-auto flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <span className="text-3xl font-bold">Lead Management</span>
          <p style={{ color: "#666" }}>
            Manage and track all your leads in one place
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/leads/add-lead")}
        >
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <Card className="hover-card">
        <div className="flex flex-wrap gap-4 justify-between items-center">

          {/* 🔍 Search */}
          <Input
            placeholder="Search leads..."
            prefix={<SearchOutlined />}
            allowClear
            size="large"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            style={{ flex: 1, minWidth: 200 }}
          />

          {/* 🎯 Filters */}
          <Space wrap>
            <Dropdown menu={statusMenu}>
              <Button>{status} <DownOutlined /></Button>
            </Dropdown>

            <Dropdown menu={priorityMenu}>
              <Button>{priority} <DownOutlined /></Button>
            </Dropdown>

            <Dropdown menu={stageMenu}>
              <Button>{stage} <DownOutlined /></Button>
            </Dropdown>

            {/* 🔄 Reset */}
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText("");
                setStatus("All Status");
                setPriority("All Priority");
                setStage("All Stages");
              }}
            >
              Reset
            </Button>
          </Space>

        </div>
      </Card>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <LeadTable
          data={filteredLeads}
          page={page}
          size={size}
          total={filteredLeads.length}
          onChangePage={(p, s) => {
            setPage(p);
            setSize(s);
          }}
        />
      </div>

    </div>
  );
}

export default Leads;