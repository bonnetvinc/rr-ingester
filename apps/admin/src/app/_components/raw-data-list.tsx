'use client';
import { api } from '~/trpc/react';
import RawDataCard from './raw-data-card';

function RawDataList() {
  const { data: raws } = api.rawData.getAllRaws.useQuery(undefined, { refetchInterval: 3000 });

  return (
    <div>
      {raws
        ? raws.map(raw => (
            <span key={raw.id}>
              <RawDataCard data={raw} />
            </span>
          ))
        : 'Loading tRPC query...'}
    </div>
  );
}

export default RawDataList;
