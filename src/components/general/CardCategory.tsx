import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function CardCategory({ name, image, colorClass, slug }) {
  return (
    <div className="flex justify-evenly items-center my-2">
      {/* Link */}
      <Link
        to={`/blog/category/${slug}`} // Ubah tujuan link berdasarkan slug kategori
        className={`${colorClass} drop-shadow-xl text-white rounded px-3 py-2 hover:${
          colorClass.split("-")[0]
        }-600`}
      >
        <img
          src={image}
          alt={name}
          className="inline object-cover rounded-md shadow-md mx-1"
          style={{ width: "25px" }}
        />
        {name}
      </Link>
    </div>
  );
}

CardCategory.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};
