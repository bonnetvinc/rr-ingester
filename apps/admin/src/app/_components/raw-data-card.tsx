import type { RawPassing } from '@repo/database';

type RawDataCardProps = {
  data: RawPassing; // Replace 'any' with the actual type of your raw data
};

function RawDataCard({ data }: RawDataCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white flex flex-row items-center gap-2">
      <div>{data.bib}</div>
      <div>{data.deviceId}</div>
      <div>{data.timingPoint}</div>
    </div>
  );
}

export default RawDataCard;
