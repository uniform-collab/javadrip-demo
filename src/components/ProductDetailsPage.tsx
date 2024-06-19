import { FC, useEffect, useMemo } from 'react';
import { useUniformContext } from '@uniformdev/context-react';
import { camelize } from '@/utilities';
import Page from './Page';
import { PageProps } from './Page';

const ProductDetailsPage: FC<PageProps> = props => {
  const { context } = useUniformContext();
  const { pageSubcategories } = props.data?.parameters || {};

  const subcategories = pageSubcategories?.value as string[] | string | undefined;

  const enrichments = useMemo(() => {
    if (Array.isArray(subcategories)) {
      return (
        subcategories?.map((subCategory: string) => ({
          cat: 'subCategory',
          key: camelize(subCategory),
          str: 5,
        })) || []
      );
    }

    return [
      {
        cat: 'subCategory',
        key: camelize(subcategories?.toString() || ''),
        str: 5,
      },
    ];
  }, [subcategories]);

  useEffect(() => {
    context.update({ enrichments });
  }, [context, enrichments]);

  return <Page {...props} />;
};

export default ProductDetailsPage;
