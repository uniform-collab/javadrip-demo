import { FC, SVGProps } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useFakeCartContext } from './FakeCartProvider';

type Styles = {
  link?: string;
};

export type Props = {
  link: Types.ProjectMapLink;
  styles?: Styles;
};

export const BagIcon: FC<SVGProps<SVGSVGElement>> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="currentColor" {...props}>
    <path
      d="M14.9996 0C11.8761 0 9.37741 1.92322 9.37741 4.28571V7.5H3.75521C3.11331 7.49732 2.57296 7.91115 2.50579 8.45893L0.00694307 28.8161C-0.0305396 29.1187 0.0850308 29.4214 0.322421 29.6478C0.561375 29.8741 0.900274 30.0013 1.25635 30H28.7436C29.0997 30.0013 29.4386 29.8741 29.6776 29.6478C29.915 29.4214 30.0305 29.1187 29.9931 28.8161L27.4942 8.45893C27.4271 7.91115 26.8867 7.49732 26.2448 7.5H20.6226V4.28571C20.6226 1.92322 18.1237 0 15.0004 0H14.9996ZM11.8761 4.28571C11.8761 3.10179 13.2754 2.14286 14.9996 2.14286C16.7238 2.14286 18.1232 3.10179 18.1232 4.28571V7.5H11.8761V4.28571ZM25.1199 9.64285L27.3564 27.8571H2.64304L4.87953 9.64285H9.37745V11.7857C9.37745 12.3777 9.93655 12.8571 10.6269 12.8571C11.3172 12.8571 11.8763 12.3777 11.8763 11.7857V9.64285H18.1234V11.7857C18.1234 12.3777 18.6825 12.8571 19.3728 12.8571C20.0632 12.8571 20.6223 12.3777 20.6223 11.7857V9.64285H25.1199Z"
      fill="currentColor"
    />
  </svg>
);

const CartIcon: FC<Props> = ({ link, styles }) => {
  const { totalFakeCartItemsCount } = useFakeCartContext();
  if (!link) {
    return null;
  }

  return (
    <Link
      aria-label="header-cart"
      className={classNames('flex items-center cursor-pointer justify-end', styles?.link, {
        'justify-between': Boolean(totalFakeCartItemsCount),
      })}
      href={link?.path}
    >
      {Boolean(totalFakeCartItemsCount) && (
        <div className="full pr-1.5 navbar-item font-extrabold">{totalFakeCartItemsCount}</div>
      )}
      <BagIcon width={24} height={24} />
    </Link>
  );
};

export default CartIcon;
