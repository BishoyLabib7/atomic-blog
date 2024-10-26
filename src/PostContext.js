// CONTEXT PROVIDER COMPONENT

import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

// 1) create new context
const PostContext = createContext();

export function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [aPosts, setaPosts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10 }, () => createRandomPost())
  );

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleCheckPost(checkpost) {
    const getPost = posts.find((post) => post.title === checkpost.title);
    return getPost ? false : true;
  }

  function handleAddPost(post) {
    if (handleCheckPost(post)) setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    console.log(aPosts, posts);
    setaPosts((aPosts) => [...posts, ...aPosts]);
    setPosts([]);
  }

  // 2) provide value to child components
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
        aPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// Coustom hook
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was use outside of the PostProvider");
  return context;
}

export { PostProvider, usePosts };
