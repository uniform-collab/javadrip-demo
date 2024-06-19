declare namespace EntrySearch {
  type GetEntriesResponse = import('@uniformdev/canvas').GetEntriesResponse;
  type ParameterRichTextValue = import('@uniformdev/richtext').ParameterRichTextValue;
  type ComponentInstance = import('@uniformdev/canvas-react').ComponentInstance;

  type UniformContentEntry = GetEntriesResponse['entries']['0'];

  type UniformContentEntrySystemParams = {
    id: string;
    slug?: string;
    contentType: string;
    created: string;
    modified: string;
  };

  type WithUniformContentEntrySystemParams<T> = T & UniformContentEntrySystemParams;

  type EntryResultItem = EntrySearch.WithUniformContentEntrySystemParams<EntrySearch.ProductEntry>;

  type UniformBlockValue = {
    _id?: string;
    type: string;
    fields?: ComponentInstance['parameters'];
  };
  type FilterBlock = {
    id: string;
    filterName?: string;
    key: Filters[keyof Filters];
    operator: string;
    value: string;
  };

  type MappedUniformAsset = {
    file: string;
    height: number;
    id: string;
    mediaType: string;
    size: number;
    title: string;
    url: string;
    width: number;
  };

  type ProductVariant = {
    title?: string;
    code?: string;
    price?: number;
    currency?: number;
    imageGallery?: MappedUniformAsset[];
    available?: boolean;
    primary?: boolean;
  };
  type ProductRecommendation = {
    slug?: string;
    title?: string;
    shortDescription?: number;
    category?: number;
    productImage?: MappedUniformAsset[];
  };

  type ProductEntry = {
    title: string;
    name: string;
    shortDescription?: string;
    body: ParameterRichTextValue;
    primaryImage: MappedUniformAsset[];
    category?: string;
    brand?: string;
    variants: ProductVariant[];
    recommendations: ProductRecommendation[];
  };
}
