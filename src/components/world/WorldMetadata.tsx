import { MetadataBadge } from './MetadataBadge';

interface WorldMetadataProps {
  mood: string;
  energy: string;
  emojiCount: number;
}

export function WorldMetadata({ mood, energy, emojiCount }: WorldMetadataProps) {
  return (
    <div className="flex gap-2 items-center justify-center text-xs flex-wrap">
      <MetadataBadge text={mood} />
      <MetadataBadge text={energy} />
      <MetadataBadge text={`${emojiCount} emoji${emojiCount !== 1 ? 's' : ''}`} />
    </div>
  );
}
