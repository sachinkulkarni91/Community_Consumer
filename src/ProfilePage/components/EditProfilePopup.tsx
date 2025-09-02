import React, { useState } from 'react'
import ImageUpload from '../../CommonComponents/ImageUpload'

import { toast } from 'react-toastify'
import { editUser, uploadProfilePhoto } from '../../services/user'
import { useUser } from '../../Contexts/UserContext'
import displayError from '../../utils/error-toaster'

type Props = {
  ref: React.RefObject<HTMLDivElement | null>,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

// Popup to edit user profile information including profile picture
const EditProfilePopup = ({ref, setVisible} : Props) => {
  const {user, setUser} = useUser()
  if (!user) throw Error("user not found")
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState<string>(user?.email)
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')

  const handleSubmit = async () => {
    try {
      // Validate passwords match if password is being changed
      if (password && password !== confirm) {
        toast.error("Your passwords do not match")
        return
      }

      // Upload profile photo if changed
      if (file) {
        const returnedUser = await uploadProfilePhoto(file)
        setUser((u) => {
          if (!u) return null
          return {...u, profilePhoto: returnedUser.profilePhoto}
        })
      }

      // Update email and/or password if changed
      if (email !== user.email || password) {
        const userInfo = await editUser(email !== user.email ? email : '', password) 
        setUser({
          name: userInfo.name,
          username: userInfo.username,
          email: userInfo.email,
          id: userInfo.id,
          role: userInfo.role,
          communities: userInfo.joinedCommunities,
          profilePhoto: userInfo.profilePhoto
        })
        toast.success("Profile updated successfully!")
      }

    } catch (error) {
      displayError(error)
    } finally {
      setVisible(false)
    }
  }

  return (
    <>
      <div ref={ref} className='fixed w-[90vw] max-w-[500px] max-h-[90vh] bg-post z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 md:p-6 text-left overflow-y-auto' >
        <div className='text-text text-[20px] md:text-[24px] font-bold font-condensed mb-4 md:mb-6' >Edit Profile</div>
        
        {/* Email Field */}
        <div className='w-full border-lightText text-text text-[14px] md:text-[16px] h-[48px] md:h-[56px] border-1 rounded-lg relative mb-4 md:mb-6' >
          <label htmlFor="Email" className='top-[-14%] left-6 md:left-8 absolute text-xs z-10 bg-post px-1 text-lightText'>Email</label>
          <input id="Email" className='w-full h-full outline-none px-3 md:px-4 py-2' type="email" placeholder='Email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}}/>
        </div>
        
        {/* Profile Picture */}
        <div className='text-text text-[16px] md:text-[20px] font-bold font-condensed mb-4 md:mb-6' >Profile Picture</div>
        <div className='mb-4 md:mb-6'>
          <ImageUpload width="64" height="64" setFile={setFile}></ImageUpload>
        </div>
        
        {/* Password Section */}
        <div className='text-text text-[16px] md:text-[20px] font-bold font-condensed mb-4 md:mb-6' >New Password</div>
        <div className='w-full border-lightText text-text text-[14px] md:text-[16px] h-[48px] md:h-[56px] border-1 rounded-lg relative mb-4 md:mb-6' >
          <label htmlFor="NewPassword" className='top-[-14%] left-6 md:left-8 absolute text-xs z-10 bg-post px-1 text-lightText'>New Password</label>
          <input id="NewPassword" className='w-full h-full outline-none px-3 md:px-4 py-2' type="password" placeholder='Change your password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}}/>
        </div>
        <div className='w-full border-lightText text-text text-[14px] md:text-[16px] h-[48px] md:h-[56px] border-1 rounded-lg relative mb-4 md:mb-6' >
          <label htmlFor="ConfirmPassword" className='top-[-14%] left-6 md:left-8 absolute text-xs z-10 bg-post px-1 text-lightText'>Confirm New Password</label>
          <input id="ConfirmPassword" className='w-full h-full outline-none px-3 md:px-4 py-2' type="password" placeholder='Confirm your password' value={confirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setConfirm(e.target.value)}}/>
        </div>
        
        {/* Buttons */}
        <div className='flex justify-between items-center pt-2' >
          <button className='py-2 px-4 rounded-2xl text-lightText cursor-pointer hover:bg-secondary transition-colors' onClick={() => {setVisible(false)}}>Cancel</button>
          <button className='py-2 px-4 rounded-2xl text-white bg-[#00338D] flex items-center gap-2 hover:bg-[#002266] transition-colors' onClick={handleSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 
                .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
              />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
      <div className='fixed w-full h-full bg-black opacity-30 z-30 top-0 left-0' onClick={() => setVisible(false)}></div>
    </>
  )
}

export default EditProfilePopup