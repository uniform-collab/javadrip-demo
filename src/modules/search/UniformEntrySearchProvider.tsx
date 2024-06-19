import {
  FC,
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { mapCanvasParameters, mapUniformContentEntryFields, useGetSearchEngine } from './utils';
import { ComponentProps } from '@uniformdev/canvas-react/dist';

const ENTRY_SEARCH_ENDPOINT = '/api/getEntries';

export const ARRAY_OPERATORS = ['in', 'nin'];

interface UniformEntrySearchContextProps {
  search: string;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  setSearch: Dispatch<SetStateAction<string>>;
  setAdditionalFilters: Dispatch<SetStateAction<Record<string, unknown>>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  resultEntries: EntrySearch.EntryResultItem[];
}

export const UniformEntrySearchContext = createContext<UniformEntrySearchContextProps>({
  search: '',
  pageSize: 50,
  totalPages: 0,
  totalCount: 0,
  currentPage: 0,
  setSearch: () => null,
  setAdditionalFilters: () => null,
  setCurrentPage: () => null,
  isLoading: false,
  resultEntries: [],
});

export type UniformEntrySearchContextProviderProps = {
  initialFilters?: EntrySearch.UniformBlockValue[];
  pageSize?: string;
  children: ReactNode;
};

const UniformEntrySearchContextProvider: FC<ComponentProps<UniformEntrySearchContextProviderProps>> = ({
  initialFilters,
  pageSize: initPageSize,
  children,
}) => {
  const { locale = 'en-US' } = useRouter();
  const pageSize = Number(initPageSize);
  const [search, setSearch] = useState<string>('');
  const [additionalFilters, setAdditionalFilters] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultEntries, setResultEntries] = useState<EntrySearch.EntryResultItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const searchEngine = useGetSearchEngine({
    endpoint: ENTRY_SEARCH_ENDPOINT,
    setResultEntries,
    setTotalCount,
    setIsLoading,
    mapUniformContentEntryFields,
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize]);

  const baseFilter = useMemo(
    () =>
      initialFilters
        ?.map(({ fields, _id }, index) => mapCanvasParameters<EntrySearch.FilterBlock>(fields, _id || String(index)))
        .reduce<Record<string, unknown>>((acc, { key, operator, value }) => {
          acc[key] = ARRAY_OPERATORS.includes(operator) ? { [operator]: value.split('|') } : { [operator]: value };
          return acc;
        }, {}) || {},
    [initialFilters]
  );

  useEffect(() => {
    setIsLoading(true);
    searchEngine({
      filters: { ...baseFilter, ...additionalFilters },
      locale,
      withTotalCount: true,
      limit: pageSize,
      offset: currentPage * pageSize,
      ...(search ? { search } : undefined),
    });
  }, [additionalFilters, baseFilter, currentPage, locale, pageSize, search, searchEngine]);

  const value = useMemo(
    () => ({
      search,
      pageSize,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      isLoading,
      resultEntries,
      setSearch,
      setAdditionalFilters,
      setCurrentPage,
    }),
    [search, pageSize, currentPage, totalCount, isLoading, resultEntries]
  );

  return <UniformEntrySearchContext.Provider value={value}>{children}</UniformEntrySearchContext.Provider>;
};

export default UniformEntrySearchContextProvider;

export const useUniformEntrySearchContext = () => useContext(UniformEntrySearchContext);
