import React, { useEffect, useState } from 'react'
import getMyProfile from '../Api/Auth/gitMyProfile'
import profileNoPage from "../asset/profileNoPosts.png"
import getUserPosts from '../Api/Auth/getUserPosts'
import getBookmarks from '../Api/Users/getBookMarks'
import EditProfilePhoto from '../Components/Post/upliadProfilePhoto'
import PostCard from '../Components/Post/PostCard'
import getUserProfile from "../Api/Auth/getUserProfile";
import { useNavigate } from 'react-router-dom';

function UserRow({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      setLoading(true);
      const res = await getUserProfile(id);
      if (isMounted) {
        setUser(res?.data?.user || null);
        setLoading(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-3 odd:bg-[var(--color-bg-page)] even:bg-[var(--color-bg-card)]">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    );
}

  if (!user) return null;

  return (
    <div onClick={() => navigate(`/userProfile/${user.id}`)}
    className="cursor-pointer flex items-center gap-3 p-3 rounded-card odd:bg-[var(--color-bg-page)] even:bg-[var(--color-bg-card)] hover:bg-[var(--color-accent-soft)] transition-colors duration-200">
      <img
        src={user.photo}
        alt={user.name}
        className=" w-10 h-10 rounded-full object-cover"
      />
      <p className="text-sm font-medium text-text-primary">{user.name}</p>
    </div>
  );
}


function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth)
  const diff = Date.now() - dob.getTime()
  return Math.abs(new Date(diff).getUTCFullYear() - 1970)
}

function formatJoinDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-colors duration-200 ${active
        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
        : "text-text-secondary hover:text-text-primary"
        }`}
    >
      {children}
    </button>
  )
}



export default function Profile() {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [tabLoading, setTabLoading] = useState(false)

  async function getProfile() {
    try {
      setLoading(true)
      const res = await getMyProfile()
      const user = res.user ?? res
      setData(user)
      return user
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function getPosts(userId) {
    try {
      const res = await getUserPosts(userId)
      setPosts(res.posts || [])
    } catch (err) {
      console.error("Error fetching posts:", err)
    }
  }

  async function fetchBookmarks(userId) {
    setTabLoading(true)
    try {
      const res = await getBookmarks(userId)
      setBookmarks(res?.data?.bookmarks || [])
    } catch (err) {
      console.error("Error fetching bookmarks:", err)
    } finally {
      setTabLoading(false)
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const user = await getProfile()
        if (user?.id) {
          await getPosts(user.id)
        }
      } catch (err) {
        console.log(err)
      }
    }
    init()
  }, [])


  useEffect(() => {
    if (activeTab === 'bookmarks' && data?.id) {
      fetchBookmarks(data.id)
    }
  }, [activeTab, data?.id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card animate-pulse h-48" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card">
          <p>Couldn't load this profile.</p>
          <button className="btn-primary mt-4" onClick={getProfile}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  const {
    name,
    username,
    photo,
    cover,
    followers = [],
    following = [],
    followersCount,
    followingCount,
    bookmarksCount,
    createdAt,
    dateOfBirth,
    id
  } = data

  return (
    <div className="max-w-2xl mx-4 md:mx-auto pb-10">
      {/* Cover — زي ما هو */}
      <div
        className="h-40 rounded-card bg-accent-soft"
        style={
          cover
            ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />

      {/* Header — زي ما هو */}
      <div className="card -mt-10 relative">
        <EditProfilePhoto currentPhoto={photo} />
        <div className="mt-4">
          <h1 className="text-section">{name}</h1>
          <p className="text-text-secondary">@{username}</p>
        </div>

        <div className="flex gap-2 mt-3">
          {dateOfBirth && <span className="chip">{calculateAge(dateOfBirth)} yrs</span>}
          {createdAt && <span className="chip">Joined {formatJoinDate(createdAt)}</span>}
        </div>

        {/* Stats — زي ما هي */}
        <div className="bento-grid mt-6" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <StatBlock label="Followers" value={followersCount} />
          <StatBlock label="Following" value={followingCount} />
          <StatBlock label="Bookmarks" value={bookmarksCount} />
        </div>
      </div>

      {/* التابات الجديدة */}
      <div className="flex gap-1 mt-6 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-page)] p-1.5">
        <TabButton active={activeTab === 'followers'} onClick={() => setActiveTab('followers')}>
          Followers
        </TabButton>
        <TabButton active={activeTab === 'following'} onClick={() => setActiveTab('following')}>
          Following
        </TabButton>
        <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
          Posts
        </TabButton>
        <TabButton active={activeTab === 'bookmarks'} onClick={() => setActiveTab('bookmarks')}>
          Saved
        </TabButton>
      </div>

      {/* محتوى التاب */}
      <div className="mt-4">
        {activeTab === 'followers' && (
          followers.length > 0 ? (
            <div className="flex flex-col gap-1">
              {followers.map((f) => <UserRow key={f._id} user={f} />)}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">No followers yet.</p>
          )
        )}

        {activeTab === 'following' && (
          following.length > 0 ? (
            <div className="flex flex-col gap-1">
              {following.map((id) => <UserRow key={id} id={id} />)}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">Not following anyone yet.</p>
          )
        )}

        {activeTab === 'posts' && (
          posts && posts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          ) : (
            <div className="card">
              <img src={profileNoPage} alt="profileNoPage" className="mt-3 w-full max-h-130 object-cover" />
              <p className="text-center text-text-secondary">You don't have any posts yet. Share your first Loop!</p>
            </div>
          )
        )}

        {activeTab === 'bookmarks' && (
          tabLoading ? (
            <p className="text-center text-text-secondary py-8">Loading...</p>
          ) : bookmarks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {bookmarks.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">No saved posts yet.</p>
          )
        )}
      </div>
    </div>
  )
}

function StatBlock({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-section" style={{ fontSize: '1.5rem' }}>{value}</div>
      <div className="text-label text-text-secondary">{label}</div>
    </div>
  )
}