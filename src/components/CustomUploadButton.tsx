import { useRef, useState, useEffect } from "react"
import { toast } from "react-toastify"

interface Props {
  onUpload: (file: File) => void
  defaultImage?: string
}

function CustomUploadButton({ onUpload, defaultImage }: Props) {

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [image, setImage] = useState<string>("")

  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage)
    }
  }, [defaultImage])

  const handleClick = () => {
    fileRef.current?.click()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB")
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setImage(previewUrl)

    onUpload(file)

    return () => URL.revokeObjectURL(previewUrl)
  }

  return (
    <div className="flex gap-5 items-center">

      {/* ✅ Image Preview */}
      <img
        src={image || image !== "" ? image : "/default-profile.png"}
        className="h-20 w-20 object-cover rounded-full bg-blue-50"
      />

      <input
        type="file"
        ref={fileRef}
        onChange={handleFile}
        accept="image/png, image/jpeg, image/gif"
        hidden
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={handleClick}
          className="border border-blue-200 h-10 w-40 
          rounded-md text-black font-semibold bg-blue-100 hover:bg-blue-200"
        >
          Upload Photo
        </button>

        <p className="text-gray-600 text-sm">
          JPG, PNG or GIF. Max 10MB.
        </p>
      </div>

    </div>
  )
}

export default CustomUploadButton;