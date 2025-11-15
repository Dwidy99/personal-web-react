interface CardAparatursProps {
  image: string;
  name: string;
  role: string;
}

export default function CardAparaturs({ image, name, role }: CardAparatursProps): JSX.Element {
  return (
    <div className="col-md-4">
      <div className="card border-0 shadow-sm rounded-3 text-center text-uppercase">
        <div className="card-body mt-2">
          <div className="text-center mb-3">
            <img src={image} alt={name} className="w-50 rounded-pill object-cover" loading="lazy" />
          </div>
          <h5>{name}</h5>
          <hr />
          <h6>
            <i>{role}</i>
          </h6>
        </div>
      </div>
    </div>
  );
}
