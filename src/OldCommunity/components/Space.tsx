import { useEffect, useState } from 'react'
import Post from '../../CommonComponents/Post'
import { deletePost} from '../../services/posts'
import { useUser } from '../../Contexts/UserContext';
import { getSpace } from '../../services/spaces';
import ChatSpace from '../../CommonComponents/ChatSpace';

import postCleaner from '../../utils/post.middleware';
import displayError from '../../utils/error-toaster';

type Props = {
  spaceID: string
}
// Generic space holder that either displays a feed or a chat
const Space = ({spaceID} : Props) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [space, setSpace] = useState<RawSpace>()

  const {user} = useUser()

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

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const completeSpace = await getSpace(spaceID);
        setSpace(completeSpace);
        console.log('completeSpace', completeSpace)

        if (completeSpace?.type === "feed") {
          console.log('completeSpace.posts', completeSpace.posts)
          const modifiedPosts = postCleaner(completeSpace.posts, user, completeSpace.community.name)
        setPosts(modifiedPosts)
          setPosts(modifiedPosts)
        }
      } catch (error) {
        console.log('error', error)
        displayError(error)  
      }
    }
    handleFetch()

  }, [spaceID, user])  

  if (!space) {
  return <div className="p-8 text-center text-lightText mx-auto my-auto">Loading space...</div>;
  }
  if (space.type === 'feed') {
  return (
    <div className='flex-1 mt-12 h-full pr-2 mr-20'>
          <div className='flex justify-between items-center mb-8'>
            <div className='font-bold text-[24px] font-condensed text-text'>{space.name}</div>
          </div>
          <div className='overflow-scroll h-full pb-24'>
          {posts.map((p: Post) => 
            <Post key={p.id} id={p.id} title={p.title} author={p.author} likes={p.likes} comments={p.comments} community={p.community} body={p.body} handleDeletePost={handleDeletePost} likedInitial={p.liked} time={p.time} profilePhoto={p.profilePhoto} communityProfilePhoto={p.communityProfilePhoto}></Post>)}
          </div>
        </div>
  ) 
}
if (space.type === 'chat') return <ChatSpace space={space}></ChatSpace>
}

export default Space