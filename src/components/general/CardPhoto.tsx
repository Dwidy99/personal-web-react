interface CardPhotoProps {
  id: number | string;
  image: string;
  caption: string;
}

export default function CardPhoto({ id, image, caption }: CardPhotoProps): JSX.Element {
  return (
    <div className="col-md-4 mb-4">
      <div className="card border-0 shadow-sm rounded-3 text-center" key={id}>
        <div className="card-body mt-2">
          <div className="text-center mb-3">
            <img src={image} alt={caption} className="w-100 rounded object-cover" loading="lazy" />
          </div>
          <hr />
          <h6>
            <i>{caption}</i>
          </h6>
        </div>
      </div>
    </div>
  );
}
