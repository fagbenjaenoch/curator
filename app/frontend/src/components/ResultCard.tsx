interface ResultCardProps {
  title: string;
  thumbUrl: string;
  url: string;
}

export default function ResultCard({ title, thumbUrl, url }: ResultCardProps) {
  return (
    <div className="p-4 shadow-md">
      <a href={url}>
        <img src={thumbUrl} alt={title} />
        {title}
      </a>
    </div>
  );
}
