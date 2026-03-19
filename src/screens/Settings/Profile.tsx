import { Card } from 'antd'
import { useEffect, useState } from 'react'
import { UpdateProfile, ViewProfile, addProfile } from '../../services/SettingServices'
import { toast } from 'react-toastify'
import CustomUploadButton from '../../components/CustomUploadButton'
import UpdateProfileForm from '../../components/UpdateProfileForm'

interface ProfilePayload {
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  role_id: string,
  profile_image?: string
}

function Profile() {

  const [profile, setProfile] = useState<ProfilePayload | null>(null)

  // ✅ Fetch Profile
  const fetchProfile = async () => {
    try {
      const response = await ViewProfile()
      const data = response.data

      const formattedProfile: ProfilePayload = {
        first_name: data.First_Name,
        last_name: data.Last_Name,
        email: data.Email,
        phone: data.Phone,
        role_id: data.Role_Name,
        profile_image: data.Profile_Pic_URL // 👈 updated key
      }

      setProfile(formattedProfile)

    } catch (error: any) {
      toast.error(error.message || "Failed to load profile")
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // ✅ Upload Image (separate API)
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      await addProfile(formData)
      toast.success("Profile image uploaded successfully")

      fetchProfile()

    } catch (error: any) {
      toast.error(error.message || "Image upload failed")
    }
  }

  // ✅ Update Profile (text only)
  const handleUpdate = async (values: any) => {

    const formData = new FormData()
    formData.append("first_name", values.first_name)
    formData.append("last_name", values.last_name)
    formData.append("email", values.email)
    formData.append("phone", values.phone)

    try {
      await UpdateProfile(formData)
      toast.success("Profile updated successfully")

      fetchProfile()

    } catch (error: any) {
      toast.error(error.message || "Update failed")
    }
  }

  return (
    <Card>
      <div className='flex flex-col gap-5'>

        <h1 className='text-2xl font-semibold'>Profile Information</h1>

        {/* ✅ Single Image + Upload */}
        <CustomUploadButton
          onUpload={handleUpload}
          defaultImage={profile?.profile_image}
        />

        {/* ✅ Update Form */}
        {profile && (
          <UpdateProfileForm
            profile={profile}
            onSubmit={handleUpdate}
          />
        )}

      </div>
    </Card>
  )
}

export default Profile