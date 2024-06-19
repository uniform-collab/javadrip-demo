import { FC, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';
import { ComponentInstance } from '@uniformdev/canvas';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { useUniformEntrySearchContext } from './UniformEntrySearchProvider';
import InformationContent from '../../components/InformationContent';
import Card from '../../canvas/Card';
import { withErrorCallout } from '../../hocs/withErrorCallout';
import { SearchItemSkeleton } from './SearchItemSkeleton';

export type EntryStyles = {
  title?: string;
  description?: string;
  container?: string;
  image?: string;
  cardBody?: string;
};

const EntryItem: FC<{
  entry: EntrySearch.EntryResultItem;
  component: ComponentInstance;
  entryStyles?: EntryStyles;
}> = ({ entry, component, entryStyles }) => {
  const {
    buttonStyle,
    buttonLink,
    buttonCopy,
    badgeSize,
    badgeStyle,
    buttonAnimationType,
    lineCountRestriction,
    objectFit,
    overlayColor,
    overlayOpacity,
    textColorVariant,
    animationType,
    duration,
    delay,
    animationPreview,
  } = component.parameters || {};

  const { primaryImage, name, shortDescription, category, slug } = entry;

  return (
    <Card
      image={primaryImage?.[0].url}
      title={name}
      description={shortDescription || ''}
      badge={category?.toUpperCase()}
      badgeStyle={(badgeStyle?.value as Types.BadgeStyles) || 'primary'}
      buttonStyle={(buttonStyle?.value as Types.ButtonStyles) || 'primary'}
      lineCountRestriction={(lineCountRestriction?.value as Types.AvailableMaxLineCount) || '5'}
      badgeSize={(badgeSize?.value as Types.BadgeSize) || 'sm'}
      buttonCopy={buttonCopy?.value as string}
      objectFit={objectFit?.value as Types.AvailableObjectFit}
      overlayColor={overlayColor?.value as Types.AvailableColor}
      overlayOpacity={overlayOpacity?.value as Types.AvailableOpacity}
      buttonAnimationType={buttonAnimationType?.value as Types.AnimationType}
      buttonLink={
        // Emulate dynamic values for categories pages without dynamic input feature
        buttonLink?.value
          ? ({
              ...(buttonLink?.value as Types.ProjectMapLink),
              dynamicInputValues: {
                'product-slug': slug,
              },
            } as Types.ProjectMapLink)
          : undefined
      }
      useCustomTextElements
      textColorVariant={textColorVariant?.value as Types.AvailableTextColorVariant | undefined}
      component={component}
      animationType={animationType?.value as Types.AnimationType}
      duration={duration?.value as Types.DurationType}
      delay={delay?.value as Types.AnimationDelay}
      animationPreview={animationPreview?.value as boolean}
      styles={{
        ...entryStyles,
        container: classNames(entryStyles?.container, 'h-full'),
      }}
    />
  );
};

type SearchResultListProps = ComponentProps<{
  entryStyles?: EntryStyles;
}>;

const SearchEntryResultList: FC<ComponentProps<SearchResultListProps>> = ({ component, entryStyles }) => {
  const t = useTranslations();
  const { resultEntries, isLoading, pageSize } = useUniformEntrySearchContext();

  const cardSkeleton = useMemo(
    () => [...Array(pageSize)].map((_, index) => <SearchItemSkeleton key={index} />),
    [pageSize]
  );

  if (!resultEntries.length && !isLoading) {
    return <InformationContent title={t('Sorry there are no products for this filter') || ''} />;
  }
  return (
    <div
      className={classNames(
        'grid gap-y-3 mb-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 sm:gap-y-6 lg:gap-x-8 lg:gap-y-5 sm:mb-0 text-sm',
        { 'opacity-50': isLoading }
      )}
    >
      {isLoading && !resultEntries.length
        ? cardSkeleton
        : resultEntries.map(entry => (
            <EntryItem
              key={entry.id}
              entry={entry}
              entryStyles={entryStyles}
              component={component?.slots?.resultItem?.[0] || { type: 'card' }}
            />
          ))}
    </div>
  );
};

registerUniformComponent({
  type: 'searchEntryResultList',
  component: withErrorCallout(
    SearchEntryResultList,
    'Something went wrong. Please use Search Entry Result List components only inside the Uniform Entry Search Engine component'
  ),
});

export default SearchEntryResultList;
