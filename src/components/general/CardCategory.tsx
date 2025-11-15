import { Link } from "react-router-dom";

interface CardCategoryProps {
  name: string;
  image: string;
  colorClass: string;
  slug: string;
}

export default function CardCategory({
  name,
  image,
  colorClass,
  slug,
}: CardCategoryProps): JSX.Element {
  // Tailwind tidak mendukung interpolasi dinamis di dalam className
  // jadi kita gunakan fallback hover style manual via inline style
  const baseColor = colorClass.split("-")[0];

  return (
    <div className="flex justify-evenly items-center my-2">
      <Link
        to={`/blog/category/${slug}`}
        className={`${colorClass} drop-shadow-xl text-white rounded px-3 py-2 transition duration-200`}
        style={{ cursor: "pointer" }}
        onMouseEnter={(e) => {
          e.currentTarget.classList.add(`${baseColor}-600`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove(`${baseColor}-600`);
        }}
      >
        <img
          src={image}
          alt={name}
          className="inline object-cover rounded-md shadow-md mx-1"
          style={{ width: "25px" }}
          loading="lazy"
        />
        {name}
      </Link>
    </div>
  );
}
