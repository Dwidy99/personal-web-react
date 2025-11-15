import { Link } from "react-router-dom";

interface CardPostHomeProps {
  id?: number | string;
  slug: string;
  title: string;
  image: string;
  user: string;
  date: string | Date;
}

export default function CardPostHome({
  id,
  slug,
  title,
  image,
  user,
  date,
}: CardPostHomeProps): JSX.Element {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="col-md-6" key={id}>
      <Link to={`/posts/${slug}`} className="text-decoration-none">
        <div className="card mb-3 w-100 rounded-3 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="row g-0 mb-0 pb-0">
            {/* Thumbnail */}
            <div className="col-md-4">
              <img
                src={image}
                alt={title}
                className="img-fluid rounded h-100 w-100 object-cover"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </div>

            {/* Text Section */}
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">
                  {title.length > 50 ? `${title.substring(0, 50)}...` : title}
                </h5>
                <hr />
                <div className="d-flex justify-content-between text-sm text-gray-600">
                  <div>
                    <i className="fa fa-user mr-1"></i> {user}
                  </div>
                  <div>
                    <i className="fa fa-calendar mr-1"></i> {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
