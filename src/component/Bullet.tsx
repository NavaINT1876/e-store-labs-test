import React, {MutableRefObject, useRef} from 'react';
import {DropTargetMonitor, useDrag, useDrop, XYCoord} from 'react-dnd';
import ItemTypes from './ItemTypes';
import {Alert} from 'react-bootstrap';

interface BulletParams {
    id: number;
    text: string;
    index: number;
    moveBullet: (dragIndex: number, hoverIndex: number) => void;
    handleDelete: (index: number) => void;
    handleUpdate: (index: number, value: string) => void;
}

const style = {
    cursor: 'move',
    gap: '15px',
};

const Bullet = ({id, text, index, moveBullet, handleDelete, handleUpdate}: BulletParams) => {
    const ref: MutableRefObject<any> = useRef(null);

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item: { index: number }, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item['index'];
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset: XYCoord | null = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveBullet(dragIndex, hoverIndex);
            item['index'] = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        item: {type: ItemTypes.CARD, id, index},
        type: ItemTypes.CARD,
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drag(drop(ref));

    return (
        <Alert ref={ref} variant='light' style={{...style, opacity: isDragging ? 0 : 1}}
               className='d-flex justify-content-between align-items-center pr-5'>
            <span className='fw-bold flex-shrink-0'>[ * ]</span>
            <textarea onChange={e => handleUpdate(id, e.target.value)}
                      placeholder={text ? '' : 'Input bullet text here ...'}
                      defaultValue={text}
                      className='form-control'
                      rows={1}>
            </textarea>
            <span className='fw-bold' onClick={() => handleDelete(id)} role='button'>X</span>
        </Alert>
    );
};

export default Bullet;
