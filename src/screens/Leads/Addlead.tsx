import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Input, Button, Select } from 'antd';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { addLead } from '../../services/LeadServices';
import { toast } from 'react-toastify';
import {
  getStatuses,
  getOwners,
  getPriorities,
  getStages,
  getSources
} from '../../services/LeadServices';
import { SaveOutlined } from '@ant-design/icons';

function Addlead() {
  const navigate = useNavigate();
  const { TextArea } = Input;

  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);

  const [leadName, setLeadName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [notes, setNotes] = useState("");

  // ✅ Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [statusRes, priorityRes, stageRes, ownerRes, sourceRes] =
          await Promise.all([
            getStatuses(),
            getPriorities(),
            getStages(),
            getOwners(),
            getSources(),
          ]);

        setStatuses(statusRes.data || []);
        setPriorities(priorityRes.data || []);
        setStages(stageRes.data || []);
        setOwners(ownerRes.data || []);
        setSources(sourceRes.data || []);

      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load dropdown data");
      }
    };

    fetchDropdowns();
  }, []);

  // ✅ Submit
  const handleAddLead = async () => {
    if (!leadName || !company || !email) {
      toast.error("Please fill required fields");
      return;
    }

    if (!selectedStatus || !selectedStage || !selectedPriority || !selectedOwner) {
      toast.error("Please select all dropdown values");
      return;
    }

    try {
      const leadData = {
        Lead_Name: leadName,
        Phone: phone,
        Email: email,
        Owner_ID: selectedOwner,
        Value: Number(dealValue || 0),
        Source_ID: selectedSource,
        Notes: notes,
        Status_ID: selectedStatus,
        Stage_ID: selectedStage,
        Priority_ID: selectedPriority,
        Company_Name: company
      };

      await addLead(leadData);

      toast.success("Lead Added successfully");
      navigate("/leads");

    } catch (error:any) {
      toast.error("Error creating lead");
    }
  };

  return (
    <div className='add-lead flex flex-col gap-5'>

      {/* Header */}
      <div className='flex items-center gap-10'>
        <Button className='arrow-icon' onClick={() => navigate('/leads')}>
           <ArrowLeftOutlined/>
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Add New Lead</h1>
          <p>Create a new lead record</p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-10'>

        {/* LEFT */}
        <div className='w-full lg:w-2/3 flex flex-col gap-10'>

          <Card className='hover-card'>
            <h2 className='text-xl font-bold'>Basic Information</h2><br />
            <div className='flex gap-4 max-md:flex-col'>
              <div className='flex flex-col gap-2.5 w-1/2 max-sm:w-full'>
                <label className='text-base font-semibold'>Lead Name*</label>
                <Input value={leadName} onChange={(e) => setLeadName(e.target.value)} 
                 placeholder='Enter Lead Name'  className='custom-leadinput' />
              </div>
              <div className='flex flex-col gap-2.5 w-1/2 max-sm:w-full'>
                <label className='text-base font-semibold'>Company Name*</label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} 
              placeholder='Enter Company Name'  className='custom-leadinput' />
              </div>
            
            </div>
          </Card>

          <Card className='hover-card'>
            <h2 className='text-xl font-bold'>Contact Info</h2><br />
            <div className='flex gap-4 max-md:flex-col'>
              <div className='flex flex-col gap-2.5 w-1/2 max-sm:w-full'>
                <label className='text-base font-semibold'>Email*</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder='Email'  className='custom-leadinput' />
              </div>
              <div className='flex flex-col gap-2.5 w-1/2 max-sm:w-full'>
                <label className='text-base font-semibold'>Phone</label>
                 <Input value={phone} onChange={(e) => setPhone(e.target.value)} 
                 placeholder='Phone'  className='custom-leadinput' />
              </div>
            </div>
          </Card>

          <Card className='hover-card'>
            <h2 className='text-xl font-bold'>Lead Details</h2><br />

            <div className='flex gap-4'>
              <div className='flex flex-col gap-2.5 w-1/2'>
              <label className='text-base font-semibold'>Source</label>
            <Select
              placeholder="Select Source"
               className='custom-leadinput'
              value={selectedSource}
              onChange={(value) => setSelectedSource(value)}
              style={{ width: "100%" }}
              options={sources.map((item: any) => ({
                value: item.Source_ID,
                label: item.Source_Name,
              }))}
            />
            </div>
             <div className='flex flex-col gap-2.5 w-1/2'>
                 <label className='text-base font-semibold'>Deal Value</label>
            <Input
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              placeholder="Deal Value"
               className='custom-leadinput'
            />
            </div>
             </div>
           
          </Card>

          <Card className='hover-card'>
            <h2 className='text-xl font-bold'>Notes</h2><br />
            <TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Add any additional information about this lead'
              className='custom-leadinput!'
            />
          </Card>

        </div>

        {/* RIGHT */}
        <div className='w-full lg:w-1/3 flex flex-col gap-10'>

          <Card className='hover-card'>
            <div className='flex flex-col gap-5'>
               <h1 className='text-lg font-bold'>Status & Assignment</h1>
            <div className='flex flex-col gap-3'>
               {/* STATUS */}
            <label className='text-base font-semibold'>Status</label>
            <Select
              placeholder="Select Status"
               className='custom-leadinput'
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: "100%" }}
              options={statuses.map((item: any) => ({
                value: item.Status_ID,
                label: item.Status_Name,
              }))}
            />
            </div>
             <div className='flex flex-col gap-3'>
              <label className='text-base font-semibold'>Stage</label>
                  {/* STAGE */}
            <Select
              placeholder="Select Stage"
               className='custom-leadinput'
              value={selectedStage}
              onChange={(value) => setSelectedStage(value)}
              style={{ width: "100%" }}
              options={stages.map((item: any) => ({
                value: item.Stage_ID,
                label: item.Stage_Name,
              }))}
            />
             </div>
            
            <div className='flex flex-col gap-3'>
              <label className='text-base font-semibold'>Stage</label>
              {/* PRIORITY */}
            <Select
              placeholder="Select Priority"
               className='custom-leadinput'
              value={selectedPriority}
              onChange={(value) => setSelectedPriority(value)}
              style={{ width: "100%" }}
              options={priorities.map((item: any) => ({
                value: item.Priority_ID,
                label: item.Priority_Name,
              }))}
            />

            </div>
            <div className='flex flex-col gap-3'>
              <label className='text-base font-semibold'>Owner</label>
               {/* OWNER */}
            <Select
              placeholder="Select Owner"
               className='custom-leadinput'
              value={selectedOwner}
              onChange={(value) => setSelectedOwner(value)}
              style={{ width: "100%" }}
              options={owners.map((item: any) => ({
                value: item.User_ID,
                label: item.Username,
              }))}
            />
            </div>
           

            </div>
           
          </Card>

          <Card className='hover-card'>
            <div className='flex flex-col gap-4'>
              <Button type='primary' size='large' block onClick={handleAddLead}>
                <SaveOutlined /> Save Lead
            </Button>
            <Button block onClick={() => navigate('/leads')} size='large'>
              Cancel
            </Button>
            </div>
           
          </Card>

        </div>
      </div>
    </div>
  );
}

export default Addlead;