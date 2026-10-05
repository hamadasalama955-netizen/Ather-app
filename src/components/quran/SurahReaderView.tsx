import React from 'react';
import { QuranBookmark } from '../../types';
import { getSurahStartPage } from '../../services/quranApi';
import { MushafPageView } from './MushafPageView';

interface Props {
  surahNumber: number;
  onBack: () => void;
  onSelectAnotherSurah: (num: number) => void;
  bookmark: QuranBookmark | null;
  onSaveBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

export const SurahReaderView: React.FC<Props> = ({
  surahNumber,
  onBack,
  bookmark,
  onSaveBookmark,
}) => {
  const initialPage = getSurahStartPage(surahNumber);

  return (
    <MushafPageView
      initialPage={initialPage}
      onOpenIndex={onBack}
      bookmark={bookmark}
      onSaveBookmark={onSaveBookmark}
    />
  );
};
