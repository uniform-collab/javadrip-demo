import { useDebouncedCallback } from 'use-debounce';
import { Dispatch, SetStateAction } from 'react';
import { ExceptProject } from '@uniformdev/context/api';
import { DataResolutionOption, DataResolutionParameters, Filters, GetEntriesOptions } from '@uniformdev/canvas';

export const mapUniformContentEntryFields = <T = { [key: string]: unknown }>(
  entryPayload: EntrySearch.UniformContentEntry
): EntrySearch.WithUniformContentEntrySystemParams<T> => {
  if (!entryPayload) return Object.freeze({}) as EntrySearch.WithUniformContentEntrySystemParams<T>;

  const { entry } = entryPayload;

  const entryFields = mapUniformContentFields(entry.fields) as T;

  return {
    ...entryFields,
    id: entry._id,
    slug: entry._slug,
    contentType: entry.type,
    created: entryPayload.created,
    modified: entryPayload.modified,
  };
};

export const mapUniformContentFields = <T = { [key: string]: unknown }>(
  fields: EntrySearch.UniformContentEntry['entry']['fields']
) => {
  if (!fields) return {};

  return Object.keys(fields).reduce<{ [key: string]: unknown }>((acc, key) => {
    const parameter = fields[key];
    let value = parameter.value;

    if (Array.isArray(parameter.value)) {
      value = parameter.value.map(({ fields }) => mapUniformContentFields(fields));
    }

    acc[key] = value;
    return acc;
  }, {}) as T;
};

export const mapCanvasParameters = <T = { [key: string]: unknown }>(
  parameters: EntrySearch.ComponentInstance['parameters'],
  id: string | number
) => {
  if (!parameters) return Object.freeze({}) as T;
  const data = Object.keys(parameters).reduce<{ [key: string]: unknown }>((acc, key) => {
    const parameter = parameters[key];

    acc[key] = parameter.value;
    return acc;
  }, {}) as T;

  return { ...data, id: String(id) };
};

export const useGetSearchEngine = <T>({
  endpoint,
  setIsLoading,
  setResultEntries,
  setTotalCount,
  mapUniformContentEntryFields,
  wait = 300,
}: {
  endpoint: string;
  wait?: number;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  setResultEntries: Dispatch<SetStateAction<EntrySearch.WithUniformContentEntrySystemParams<T>[]>>;
  mapUniformContentEntryFields: (
    entryPayload: EntrySearch.UniformContentEntry
  ) => EntrySearch.WithUniformContentEntrySystemParams<T>;
  setTotalCount?: Dispatch<SetStateAction<number>>;
}) =>
  useDebouncedCallback(
    (
      body: ExceptProject<GetEntriesOptions> &
        DataResolutionParameters &
        DataResolutionOption & {
          filters?: Filters;
        }
    ) => {
      setIsLoading?.(true);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then((result: EntrySearch.GetEntriesResponse) => {
          const { entries = [], totalCount = 0 } = result;
          setResultEntries(entries.map(mapUniformContentEntryFields));
          setTotalCount?.(totalCount);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoading?.(false));
    },
    wait
  );
