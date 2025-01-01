import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  authorname: string;
  title: string;
  description: string;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorname,
  title,
  description,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="border-b border-slate-200 p-5 cursor-pointer">
        <div className="flex">
          <Avatar name={authorname} />
          <div className="pl-2">{authorname}</div>
          <div className="flex flex-col justify-center">
            <Circle />
          </div>
          <div className="text-slate-400 pl-2">{publishedDate}</div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div className="pt-1">
          {description.length > 100
            ? description.slice(0, 100) + "..."
            : description}
        </div>
        <div className="text-slate-400 text-sm pt-5">{`${Math.ceil(
          description.length / 100
        )} min read`}</div>
      </div>
    </Link>
  );
};

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ${
        size === "small" ? "w-6 h-6" : "w-8 h-8"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-xs" : "text-md"
        } font-extralight text-gray-600 dark:text-gray-300`}
      >
        {name[0]}
      </span>
    </div>
  );
}

export function Circle() {
  return <div className="w-1 h-1 rounded-full bg-slate-400 ml-2"></div>;
}
