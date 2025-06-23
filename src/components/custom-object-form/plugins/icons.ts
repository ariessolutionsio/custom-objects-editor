import ArrowClockwise from '../../../assets/icons/arrow-clockwise.svg';
import ArrowCounterClockwise from '../../../assets/icons/arrow-counterclockwise.svg';
import ChatSquareQuote from '../../../assets/icons/chat-square-quote.svg';
import ChevronDown from '../../../assets/icons/chevron-down.svg';
import Code from '../../../assets/icons/code.svg';
import Justify from '../../../assets/icons/justify.svg';
import Link from '../../../assets/icons/link.svg';
import ListOl from '../../../assets/icons/list-ol.svg';
import ListUl from '../../../assets/icons/list-ul.svg';
import TextCenter from '../../../assets/icons/text-center.svg';
import TextLeft from '../../../assets/icons/text-left.svg';
import TextParagraph from '../../../assets/icons/text-paragraph.svg';
import TextRight from '../../../assets/icons/text-right.svg';
import TypeBold from '../../../assets/icons/type-bold.svg';
import TypeH1 from '../../../assets/icons/type-h1.svg';
import TypeH2 from '../../../assets/icons/type-h2.svg';
import TypeItalic from '../../../assets/icons/type-italic.svg';
import TypeStrikethrough from '../../../assets/icons/type-strikethrough.svg';
import TypeUnderline from '../../../assets/icons/type-underline.svg';

const icons: { [key: string]: string } = {
  'arrow-clockwise': ArrowClockwise,
  'arrow-counterclockwise': ArrowCounterClockwise,
  'chat-square-quote': ChatSquareQuote,
  'chevron-down': ChevronDown,
  code: Code,
  justify: Justify,
  link: Link,
  'list-ol': ListOl,
  'list-ul': ListUl,
  'text-center': TextCenter,
  'text-left': TextLeft,
  'text-paragraph': TextParagraph,
  'text-right': TextRight,
  'type-bold': TypeBold,
  'type-h1': TypeH1,
  'type-h2': TypeH2,
  'type-italic': TypeItalic,
  'type-strikethrough': TypeStrikethrough,
  'type-underline': TypeUnderline,
};

export const getIcon = (name: string): string | undefined => {
  return icons[name];
}; 