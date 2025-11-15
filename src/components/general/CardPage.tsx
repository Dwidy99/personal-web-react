import { Link } from "react-router-dom";

interface CardPageProps {
  slug: string;
  title: string;
}

export default function CardPage({ slug, title }: CardPageProps): JSX.Element {
  return (
    <div className="col-md-4">
      <Link to={`/pages/${slug}`} className="text-decoration-none">
        <div className="card border-0 shadow-sm rounded-3 text-center text-uppercase">
          <div className="card-body mt-2">
            <h5>{title}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
}
