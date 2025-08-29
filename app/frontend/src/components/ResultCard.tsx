interface ResultCardProps {
  title: string;
  thumbUrl: string;
  url: string;
}

export default function ResultCard({ title, thumbUrl, url }: ResultCardProps) {
  return (
    <div className="p-4 shadow-md">
      <a href={url} target="blank" className="flex gap-4">
        <img src={thumbUrl} alt={title} className="object-cover w-[100px]" />
        <span className="text-left">{title}</span>
      </a>
    </div>
  );
}
