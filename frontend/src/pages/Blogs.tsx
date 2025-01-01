import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { useBlogs } from "../hooks";
import { useEffect } from "react";

export const Blogs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar></Appbar>
        <div className="flex flex-col justify-around items-center">
          <BlogsSkeleton></BlogsSkeleton>
          <BlogsSkeleton></BlogsSkeleton>
          <BlogsSkeleton></BlogsSkeleton>
          <BlogsSkeleton></BlogsSkeleton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar></Appbar>
      <div className="flex justify-center">
        <div className="w-1/2">
          {blogs.map((blog) => (
            <BlogCard
              id={blog.id}
              authorname={blog.author.name || "Anonymous"}
              title={blog.title}
              description={blog.content}
              publishedDate="12/12/12"
            ></BlogCard>
          ))}
        </div>
      </div>
    </div>
  );
};
