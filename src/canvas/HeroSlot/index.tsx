import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { metrophobic } from '../../fonts';
import {
  registerUniformComponent,
  ComponentProps,
  UniformSlot,
  UniformSlotWrapperComponentProps,
} from '@uniformdev/canvas-react';
import { withoutContainer } from '../../hocs/withoutContainer';
import BaseHero, { BaseHeroProps, BaseHeroVariant, useHeroAnimation } from '../../components/BaseHero';
import { AnimationVariant } from '../../components/AnimatedContainer';

export { BaseHeroVariant as HeroSlotVariant } from '../../components/BaseHero';
export type HeroSlotProps = ComponentProps<BaseHeroProps>;

const HeroSlot: FC<HeroSlotProps> = ({ component, ...baseProps }) => {
  const { duration = 'medium', animationOrder, delay = 'none', animationType, animationPreview } = baseProps || {};

  const { ElementWrapper, getDelayValue } = useHeroAnimation({
    duration,
    animationOrder,
    delay,
    animationType,
    animationPreview,
  });

  const buttonSectionInner = useCallback(
    ({ items }: UniformSlotWrapperComponentProps) => {
      return items.map((button, index) => (
        <ElementWrapper
          key={`hero-button-${index}`}
          duration={duration}
          delay={getDelayValue(4.5 + 1.5 * index)}
          animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInLeft}
        >
          {button}
        </ElementWrapper>
      ));
    },
    [ElementWrapper, animationType, duration, getDelayValue]
  );

  return (
    <BaseHero
      {...baseProps}
      styles={{
        eyebrowText: classNames(metrophobic.className, 'text-xl text-secondary', {
          '!tracking-[5.5px] font-bold': component.variant === BaseHeroVariant.BackgroundImage,
        }),
        description: classNames(metrophobic.className, 'text-xl', {
          'tracking-[5.5px] uppercase !py-0': component.variant === BaseHeroVariant.BackgroundImage,
          'pt-14 pb-10': [BaseHeroVariant.ImageLeft, BaseHeroVariant.ImageRight].includes(
            component.variant as BaseHeroVariant
          ),
          'text-secondary': component.variant === BaseHeroVariant.TwoColumns,
        }),
        descriptionSeparator: 'flex justify-center my-5 mx-auto bg-secondary h-1 w-24',
        sideImage: 'w-[320px] md:!w-[700px] [&>*]:rounded-none',
        textAlign: classNames({ 'text-end': component.variant === BaseHeroVariant.ImageRight }),
      }}
      variant={component?.variant}
      buttonsSlot={
        <div className="flex justify-center gap-2">
          <UniformSlot name="buttonsSection" wrapperComponent={buttonSectionInner} />
        </div>
      }
    />
  );
};

[
  undefined,
  BaseHeroVariant.ImageLeft,
  BaseHeroVariant.ImageRight,
  BaseHeroVariant.BackgroundImage,
  BaseHeroVariant.TwoColumns,
].forEach(variantId => {
  registerUniformComponent({
    type: 'heroSlot',
    component: withoutContainer(HeroSlot),
    variantId,
  });
});

export default withoutContainer(HeroSlot);
