import React, { useState } from 'react'
import { createPost } from '../services/posts'
import { useUser } from '../Contexts/UserContext'
import displayError from '../utils/error-toaster'
type Props = {
  exitFunction :  React.Dispatch<React.SetStateAction<boolean>>,
  posts: Post[],
  communityID?: string,
  spaceID?:string
}

const findTimeDifference = (createdAt: string) : string => {
  const date = new Date(createdAt);
  const dateDiff = Date.now() - date.getTime()

  if (dateDiff >= 31536000000) return `${Math.round(dateDiff / 31536000000)}y ago`
  if (dateDiff >= 2592000000) return `${Math.round(dateDiff / 2592000000)}m ago`
  if (dateDiff >= 604800000) return `${Math.round(dateDiff / 604800000)}w ago`
  if (dateDiff >= 86400000) return `${Math.round(dateDiff / 86400000)}d ago`
  if (dateDiff >= 3600000) return `${Math.round(dateDiff / 3600000)}hr ago`
  if (dateDiff >= 60000) return `${Math.round(dateDiff / 60000)}min ago`
  return `just now`
}

const NewPost = ({posts, exitFunction, communityID, spaceID} : Props) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const {user} = useUser()

  const handleNewPost = async () => {
    try {
      if (!user) throw console.error("User not defined");
      if (!communityID) throw new Error("Community ID is required");
      
      const finishedPost : RawPost = await createPost(title, content, user?.id, communityID, spaceID)
      posts.unshift({
        id: finishedPost.id,
        body: finishedPost.content,
        title: finishedPost.title,
        author: finishedPost.author.name,
        community: finishedPost.community.name,
        time: findTimeDifference(finishedPost.createdAt),
        profilePhoto: finishedPost.author.profilePhoto,
        likes: finishedPost.likes.length,
        liked: finishedPost.likes.some(u => u.username === user?.username),
        comments: 0,
        communityProfilePhoto: finishedPost.community.profilePhoto
      })
    } catch (error) {
      displayError(error)
    }
  }
  return (
    <>
    <div className='fixed w-full h-[100%] top-0 left-0 bg-black opacity-40 z-40' onClick={() => {exitFunction(false)}}>
    </div>
    <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-post rounded-2xl z-50 p-6 flex flex-col relative">
      <div className='flex justify-between items-center mb-4'>
        <div className='font-bold text-2xl text-left font-condensed text-text'>
          Create a new Post
        </div>
        <button 
          onClick={() => exitFunction(false)}
          className='text-lightText hover:text-text transition-colors p-1 rounded-full hover:bg-secondary'
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div id='title' className='relative w-3/4 font-normal text-md text-left my-4'>
          <input type="text"  className='w-full h-full outline-none border-1 border-[#C1C1C1] py-4 px-3 rounded-xl text-text' placeholder="Enter your post's title" value={title} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setTitle(e.target.value)}}/>
          <label htmlFor="title"  className='bg-post absolute text-lightText text-xs left-5 top-[-10%] px-2'>Title</label>
      </div>
      <textarea className='h-1/2 my-2 p-2 text-md outline-none text-text' placeholder="What do you want to talk about?" value={content} onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => {setContent(e.target.value)}}/>
      <div className='flex justify-center items-center mt-10' onClick={async () => {
        await handleNewPost()
        exitFunction(false)
      }}> 
        <div className='px-2 py-1 bg-[#00338D] text-white text-xs rounded-lg cursor-pointer hover:bg-[#002266] transition-colors'>Create Post</div>
      </div>
    </div>
    </>
  )
}

export default NewPost