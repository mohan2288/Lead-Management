import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import '../styles/loading.css'
import { Card, Tag } from "antd"
import { UserCard } from "../services/PipelineServices"
import placeholder from "../assets/image/placeholderimg.jpg"

interface Lead {
    lead_id: number
    lead_name: string
    company_name: string
    value: number
    priority: string
    owner: string
}

interface UserPayload {
    stage_id: number
    stage: string
    lead_count: number
    leads: Lead[]
}
function PipelineUserCard() {

    const [data, setData] = useState<UserPayload[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserCard()
                setData(response.data)
            }
            catch (error: any) {
                toast.error(error.message || "userCard not fetching")
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    console.log("data",data)

    const style = (title: string) => {
        switch (title) {
            case "New":
                return { border: "2px solid #60A5FA",background:"#EFF6FF" }
            case "Qualified":
                return { border: "2px solid #14B8A6",background:"#E6FFFA"}
            case "Negotiation":
                return { border: "2px solid orange",background:"#FFF7E6" }
            case "Proposal":
                return { border: "2px solid #8B5CF6",background:"#F3E8FF" }
            case "Won":
                return { border: '2px solid #22C55E',background:"#E8F9F0"}
            case "Lost":
                return { border: "2px solid #EF4444",background:"#FFEAEA" }
        }
    }
     const getTagColor = (value: string) => {
  switch (value) {
    case "Active":
      return "#3B82F6";

    case "Qualified":
      return "#14B8A6";

    case "Contacted":
      return "#2563EB";

    case "Proposal":
      return "#8B5CF6";

    case "New":
      return "#60A5FA";

    case "Won":
      return "#22C55E";

    case "Lost":
      return "#EF4444";

    case "Archived":
      return "#9CA3AF";

    case "High":
    case "High Priority":
      return "#EF4444";

    case "Medium":
      return "#F59E0B";

    case "Low":
      return "#22C55E";

    default:
      return "#d9d9d9";
  }
};

    if (loading) {
        return <div className="loader"></div>
    }
    else {
        return (
        <div className="flex flex-wrap gap-6 max-sm:flex-col p-4">

  {data.map((item) => (

    <Card
      key={item.stage_id}
      style={style(item.stage)}
      className="pipeline-usercard w-70 max-sm:w-full"
    >

      <h1 className="font-semibold text-base">{item.stage}</h1>
      <p className="mb-3">{item.lead_count} leads</p><br />

      <div className="flex flex-col gap-3">

        {item.leads?.map((lead,index) => (

          <Card key={index} size="small" 
          className="flex! flex-col! justify-center! items-center! gap-3!">
         <div className="flex flex-col gap-2 items-start">
            <h3 className="font-semibold text-base">{lead.lead_name}</h3>
            <p>{lead.company_name}</p>
            <Tag color={getTagColor(lead.priority)}>{lead.priority}</Tag>
            <p>${lead.value}</p>
            <div className="flex gap-3 items-center">
                 <img src={placeholder} className="h-7" alt="" />
                 <p>{lead.owner}</p>
            </div>
         </div>  
          </Card>

        ))}

      </div>

    </Card>

  ))}

</div>
        )
    }}
export default PipelineUserCard;
