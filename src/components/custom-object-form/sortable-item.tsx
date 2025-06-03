import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ViewGridPlusIcon } from '@commercetools-uikit/icons';

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
};

export const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 200ms ease',
    width: '100%',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span {...listeners} style={{ cursor: 'grab', marginRight: '8px' }}>
          <ViewGridPlusIcon />
        </span>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};
