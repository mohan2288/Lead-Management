import { Card } from 'antd'
import { useState, useEffect } from 'react'
import { PipelineCard } from '../services/PipelineServices'
import { toast } from 'react-toastify'
import '../styles/loading.css'
import { formatValue } from '../utils/formatValue'

 interface PipelinePayload{
        stage_name: string,
        lead_count: number,
        total_value: number
    }

function PipelineCards() {
    const [cardData,setCardData] = useState<PipelinePayload[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await PipelineCard();
                setCardData(response.data);
            }
            catch(error:any){
                toast.error(error.message || "card data not fetching")
            }
            finally{
                setLoading(false)
            }
        };
        fetchData();
    },[])

if (loading){
       return <div className="loader"></div>
    }

  return (
    <div className='flex flex-wrap gap-5 max-sm:flex-col w-full'>
        {cardData.map((item)=>(
            <Card key={item.stage_name} className='pipeline-card flex flex-col gap-5 flex-1'>
                <p className='text-gray-600'>{item.stage_name}</p>
                <h1 className='text-2xl font-bold'>
                    {item.lead_count}</h1>
                <p className='text-gray-600'>{formatValue(item.total_value,"currency")} value</p>
            </Card>
        ))}
    </div>
  )
}

export default PipelineCards