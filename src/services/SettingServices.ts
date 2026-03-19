import api from "./AxiosInstance";

export const ViewProfile = async()=>{
    return api.post("/userView_UserBy_id",)
    }

export const UpdateProfile = async(formData:FormData)=>{
    return api.put("/user/UpdateUser",formData,{
        headers:{
           "Content-Type" :  "multipart/form-data"
        }
    })

}

export const addProfile = async (formData:FormData)=>{
    return api.post("/user/add_profile_pic",formData,{
         headers:{
           "Content-Type" :  "multipart/form-data"
        }
    })
}

export const Viewstage = async()=>{
    return api.get("/lead/view_Stage")
}

export const CreateStage = async()=>{
    return api.post("/lead/create_Stage")
}

export const UpdateStage = async()=>{
    return api.put("/lead/update_Stage?stage_id")
}
export const DeleteStage = async()=>{
    return api.delete("/lead/stage_Delete?stage_id")
}

export const viewUser = async()=>{
    return api.get("/user/Adminview_Users")
}

export const editUser = async(id:number,data:any)=>{
    return api.put(`/user/AdminUpdatesUsers/${id}`,data)
}

export const UpdatePassword = async(data:any)=>{
    return api.post("/user/change_password",data)
}

export const TwofathAuthentication = async(enabled:boolean)=>{
    return api.put("/user/Twofath",{enabled:enabled})
}
