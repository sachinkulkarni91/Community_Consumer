import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { deletePost, getAllPosts } from '../services/posts'
import { useUser } from '../Contexts/UserContext'
import MainFeed from './components/MainFeed'
import postCleaner from '../utils/post.middleware'
import displayError from '../utils/error-toaster'

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const {user} = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts()
        const modifiedPosts = postCleaner(
          allPosts,
            user)
        setPosts(modifiedPosts)

      } catch (error) {
        displayError(error)
      }
    }
    fetchPosts()
  }, [user])

  // Handle community invite from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const inviteId = params.get('invite')
    
    if (inviteId && user) {
      // Redirect to community join page
      navigate(`/community/join/${inviteId}`)
    }
  }, [location, user, navigate])

  const handleDeletePost = async (id:string) => {
    try {
      await deletePost(id);
      setPosts((oldPosts) => {
        return oldPosts.filter((p) => p.id !== id)
      })
    } catch (error) {
      displayError(error)
    }    
  }

  return (
    <>
      <MainFeed handleDeletePost={handleDeletePost} posts={posts}></MainFeed>
    </>
  )
}

export default FeedPage