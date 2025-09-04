// Convert raw post data to a more usable format
const postCleaner = (
  allPosts: RawPost[] | RawShortPost[] | Array<RawPost[] | RawShortPost[]>,
  user: User | null,
  community?: string,
  communityProfilePhoto?: string
): Post[] => {
  // Support nested arrays: e.g., [[post1, post2], [post3]]
  const flatPosts: Array<RawPost | RawShortPost> = Array.isArray(allPosts[0])
    ? (allPosts as Array<Array<RawPost | RawShortPost>>).flat()
    : (allPosts as Array<RawPost | RawShortPost>);

  const modifiedPosts: Post[] = flatPosts.map((p: RawPost | RawShortPost) => {
    const communityName = 'community' in p ? p.community.name : community || 'Community';
    const communityProfilePhotoSrc =
      'community' in p
        ? p.community.profilePhoto || '/assets/generic1.png'
        : communityProfilePhoto || '/assets/generic1.png';

    const profilePhoto = p.author?.profilePhoto && p.author.profilePhoto !== ''
      ? p.author.profilePhoto
      : '/assets/generic1.png';

    return {
      id: p.id,
      title: p.title,
      body: p.content,
      author: p.author?.name || 'Unknown',
      community: communityName,
      likes: Array.isArray(p.likes) ? p.likes.length : 0,
      comments: Array.isArray(p.comments) ? p.comments.length : 0,
      profilePhoto,
      liked: Array.isArray(p.likes) ? p.likes.some(u => u.username === user?.username) : false,
      time: findTimeDifference(p.createdAt),
      communityProfilePhoto: communityProfilePhotoSrc,
    }
  })

  return modifiedPosts
}

// Find and format time since post was created
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


export default postCleaner