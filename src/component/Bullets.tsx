import React, {useCallback} from 'react'
import Bullet from './Bullet'
import update from 'immutability-helper';

const Bullets = ({bullets, setBullets}) => {
    const moveBullet = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const dragBullet = bullets[dragIndex];
            setBullets(
                update(bullets, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragBullet],
                    ],
                })
                    .map((bullet, i) => {
                        bullet.order = i;
                        return bullet;
                    }),
            )
        },
        [bullets, setBullets],
    );

    const handleDelete = id => {
        setBullets(bullets.filter(bullet => bullet.id !== id));
    };

    const handleUpdate = (id, value) => {
        const bulletIndex = bullets.findIndex(bullet => bullet.id === id);
        const updatedBullets = [...bullets];
        updatedBullets[bulletIndex].text = value;
        setBullets(updatedBullets);
    };

    return (
        <>
            {
                bullets.length > 0 &&
                bullets.map((bullet, index) => (
                    <Bullet
                        key={bullet.id}
                        index={index}
                        id={bullet.id}
                        text={bullet.text}
                        moveBullet={moveBullet}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                    />
                ))}
        </>
    )
};

export default Bullets;
