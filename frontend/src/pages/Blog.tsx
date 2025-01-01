import { Appbar } from "../components/Appbar";
import { useBlog } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useEffect } from "react";

export default function Blog() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  const id = useParams<{ id: string }>().id;
  // console.log(id);
  const { loading, blog } = useBlog({ id: id || "" });

  if (loading) {
    return (
      <div>
        <Appbar></Appbar>
        <div className="flex justify-center">
          <BlogSkeleton></BlogSkeleton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar></Appbar>
      <div className="grid grid-cols-12 px-10 w-full mt-10 pt-10 max-w-screen-xl mx-auto">
        <div className="col-span-8">
          <div className="text-5xl font-extrabold">{blog?.title}</div>
          <div className="text-slate-500 pt-3">Posted on 12/12/12</div>
          <div className="pt-5">{blog?.content}</div>
        </div>
        <div className="col-span-4">
          <div className="font-semibold text-slate-700">Author</div>
          <div className="flex pt-5">
            <div className="flex flex-col justify-center">
              <Avatar name={blog?.author.name || "Anonymous"} size="big" />
            </div>
            <div className="pl-4">
              <div className="text-2xl font-bold">
                {blog?.author.name || "Anonymous"}
              </div>
              <div>
                Random catchphrase: "I'm a catchphrase, catch me if you can!"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
