import Post from '../../CommonComponents/Post'

type Props = {
  handleDeletePost: (id: string) => void;
  posts: Post[]
}

const MainFeed = ({handleDeletePost, posts} : Props) => {
  return (
    <div className='flex-1 w-full'>
      <div className='w-full my-3 md:my-5 px-4 md:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 md:mb-7 gap-4 sm:gap-0'>
          <div className='font-bold text-[20px] md:text-[22px] font-condensed text-text'>My Feed</div>
        </div>
        <div className='overflow-y-auto h-[calc(100vh-200px)] pb-8 md:pb-11 scrollbar-hide'>
          {posts.map((p: Post) => 
            <Post key={p.id} id={p.id} title={p.title} author={p.author} likes={p.likes} comments={p.comments} community={p.community} body={p.body} handleDeletePost={handleDeletePost} likedInitial={p.liked} time={p.time} profilePhoto={p.profilePhoto} communityProfilePhoto={p.communityProfilePhoto}></Post>)}
        </div>
      </div>
    </div>
  )
}

export default MainFeed